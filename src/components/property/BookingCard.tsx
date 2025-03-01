
import { Calendar, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { differenceInDays, format, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

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
  // Format price consistently using Indian locale
  const formattedPrice = pricePerNight.toLocaleString('en-IN');
  
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isDateConflict, setIsDateConflict] = useState(false);

  // Fetch already booked dates for this property
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        setIsCheckingAvailability(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('check_in, check_out')
          .eq('property_id', propertyId)
          .eq('status', 'confirmed');
          
        if (error) {
          console.error('Error fetching bookings:', error);
          toast({
            title: "Error",
            description: "Could not check availability. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        // Process the bookings to get all dates in between check-in and check-out
        const bookedDates: string[] = [];
        
        if (data && data.length > 0) {
          console.log("Found bookings:", data);
          data.forEach(booking => {
            const checkIn = new Date(booking.check_in);
            const checkOut = new Date(booking.check_out);
            
            // Add all dates between check-in and check-out (inclusive)
            const currentDate = new Date(checkIn);
            while (currentDate <= checkOut) {
              bookedDates.push(format(currentDate, 'yyyy-MM-dd'));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
          console.log("Unavailable dates:", bookedDates);
        } else {
          console.log("No existing bookings found for property:", propertyId);
        }
        
        setUnavailableDates(bookedDates);
        setIsCheckingAvailability(false);
      } catch (error) {
        console.error('Error processing booked dates:', error);
        setIsCheckingAvailability(false);
        toast({
          title: "Error",
          description: "Could not process availability. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    if (propertyId) {
      fetchBookedDates();
    }
  }, [propertyId]);

  // Check if selected dates conflict with booked dates
  useEffect(() => {
    if (dates.checkIn && dates.checkOut) {
      const checkIn = new Date(dates.checkIn);
      const checkOut = new Date(dates.checkOut);
      
      // Check for conflicts
      let hasConflict = false;
      
      // Convert dates to string format 'YYYY-MM-DD' for comparison
      const checkInStr = format(checkIn, 'yyyy-MM-dd');
      const checkOutStr = format(checkOut, 'yyyy-MM-dd');
      
      // Generate array of all selected dates
      const selectedDates: string[] = [];
      const currentDate = new Date(checkIn);
      
      while (currentDate <= checkOut) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        selectedDates.push(dateStr);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Check if any selected date is unavailable
      hasConflict = selectedDates.some(date => unavailableDates.includes(date));
      
      console.log("Selected dates:", selectedDates);
      console.log("Has conflict:", hasConflict);
      
      setIsDateConflict(hasConflict);
    }
  }, [dates.checkIn, dates.checkOut, unavailableDates]);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    
    if (!newCheckIn) {
      onDatesChange({ ...dates, checkIn: '' });
      return;
    }
    
    // Check if selected date is in unavailable dates
    if (unavailableDates.includes(newCheckIn)) {
      toast({
        title: "Date unavailable",
        description: "This date is already booked. Please select another date.",
        variant: "destructive",
      });
      return;
    }
    
    onDatesChange({ ...dates, checkIn: newCheckIn });
    
    // If checkout is before new check-in, reset checkout
    if (dates.checkOut && new Date(dates.checkOut) <= new Date(newCheckIn)) {
      onDatesChange({ checkIn: newCheckIn, checkOut: '' });
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckOut = e.target.value;
    
    if (!newCheckOut) {
      onDatesChange({ ...dates, checkOut: '' });
      return;
    }
    
    // Generate array of dates from check-in to check-out
    const checkIn = new Date(dates.checkIn);
    const checkOut = new Date(newCheckOut);
    
    const selectedDates: string[] = [];
    const currentDate = new Date(checkIn);
    
    while (currentDate <= checkOut) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      selectedDates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Check if any selected date is unavailable
    const hasConflict = selectedDates.some(date => unavailableDates.includes(date));
    
    if (hasConflict) {
      toast({
        title: "Date unavailable",
        description: "Some of your selected dates are already booked. Please choose different dates.",
        variant: "destructive",
      });
      return;
    }
    
    onDatesChange({ ...dates, checkOut: newCheckOut });
  };

  return (
    <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-airbnb-dark">₹{formattedPrice}</span>
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

      {unavailableDates.length > 0 && (
        <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This property has {unavailableDates.length} unavailable dates. Please choose dates carefully.
          </AlertDescription>
        </Alert>
      )}

      {dates.checkIn && dates.checkOut && !isDateConflict && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>₹{formattedPrice} × {differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))} nights</span>
            <span>₹{(pricePerNight * differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{(pricePerNight * differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))).toLocaleString('en-IN')}</span>
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
