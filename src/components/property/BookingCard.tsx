
import { Calendar, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { differenceInDays } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingCardProps {
  pricePerNight: number;
  maxGuests: number;
  dates: {
    checkIn: string;
    checkOut: string;
  };
  guests: number;
  isLoading: boolean;
  minDate: string;
  propertyId: string;
  onDatesChange: (dates: { checkIn: string; checkOut: string }) => void;
  onGuestsChange: (guests: number) => void;
  onBookingSubmit: () => void;
}

export const BookingCard = ({
  pricePerNight,
  maxGuests,
  dates,
  guests,
  isLoading,
  minDate,
  propertyId,
  onDatesChange,
  onGuestsChange,
  onBookingSubmit,
}: BookingCardProps) => {
  const priceInRupees = Math.round(pricePerNight * 83);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isDateConflict, setIsDateConflict] = useState(false);

  // Fetch already booked dates for this property
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('check_in, check_out')
          .eq('property_id', propertyId)
          .eq('status', 'confirmed');
          
        if (error) {
          console.error('Error fetching bookings:', error);
          return;
        }
        
        // Process the bookings to get all dates in between check-in and check-out
        const bookedDates: string[] = [];
        
        if (data) {
          data.forEach(booking => {
            const checkIn = new Date(booking.check_in);
            const checkOut = new Date(booking.check_out);
            
            // Add all dates between check-in and check-out (inclusive)
            const currentDate = new Date(checkIn);
            while (currentDate <= checkOut) {
              bookedDates.push(currentDate.toISOString().split('T')[0]);
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
        }
        
        setUnavailableDates(bookedDates);
      } catch (error) {
        console.error('Error processing booked dates:', error);
      }
    };
    
    if (propertyId) {
      fetchBookedDates();
    }
  }, [propertyId]);

  // Check if selected dates conflict with booked dates
  useEffect(() => {
    if (dates.checkIn && dates.checkOut) {
      setIsCheckingAvailability(true);
      
      // Convert selected dates to Date objects
      const checkIn = new Date(dates.checkIn);
      const checkOut = new Date(dates.checkOut);
      
      // Check for conflicts
      const conflict = unavailableDates.some(date => {
        const bookedDate = new Date(date);
        return bookedDate >= checkIn && bookedDate <= checkOut;
      });
      
      setIsDateConflict(conflict);
      setIsCheckingAvailability(false);
    }
  }, [dates.checkIn, dates.checkOut, unavailableDates]);

  // Format available dates for input restriction
  const disabledDates = unavailableDates.map(date => date);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    
    // Check if selected date is in unavailable dates
    if (unavailableDates.includes(newCheckIn)) {
      alert('This date is already booked. Please select another date.');
      return;
    }
    
    onDatesChange({ ...dates, checkIn: newCheckIn });
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckOut = e.target.value;
    onDatesChange({ ...dates, checkOut: newCheckOut });
  };

  return (
    <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-airbnb-dark">₹{priceInRupees.toLocaleString('en-IN')}</span>
        <span className="text-airbnb-light">per night</span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center border rounded-lg p-3">
          <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input
            type="date"
            min={minDate}
            value={dates.checkIn}
            onChange={handleCheckInChange}
            className="border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-lg p-3">
          <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input
            type="date"
            min={dates.checkIn || minDate}
            value={dates.checkOut}
            onChange={handleCheckOutChange}
            className="border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-lg p-3">
          <User className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input
            type="number"
            min="1"
            max={maxGuests}
            value={guests}
            onChange={(e) => onGuestsChange(parseInt(e.target.value))}
            className="border-none focus:outline-none"
            placeholder="Guests"
          />
        </div>
      </div>

      {isDateConflict && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some of your selected dates are already booked. Please choose different dates.
          </AlertDescription>
        </Alert>
      )}

      {dates.checkIn && dates.checkOut && !isDateConflict && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>₹{priceInRupees} × {differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))} nights</span>
            <span>₹{(priceInRupees * differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{(priceInRupees * differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      <Button 
        className="w-full bg-airbnb-primary hover:bg-airbnb-primary/90 text-white"
        onClick={onBookingSubmit}
        disabled={isLoading || isCheckingAvailability || isDateConflict || !dates.checkIn || !dates.checkOut}
      >
        {isLoading ? "Confirming..." : isCheckingAvailability ? "Checking availability..." : "Reserve Now"}
      </Button>
    </div>
  );
};
