
import { Calendar, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { differenceInDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useMemo, memo } from "react";

interface BookingCardProps {
  pricePerNight: number;
  maxGuests: number;
  propertyId: string;
  dates: { checkIn: string; checkOut: string };
  guests: number;
  isLoading: boolean;
  minDate: string;
  onDatesChange: (dates: { checkIn: string; checkOut: string }) => void;
  onGuestsChange: (guests: number) => void;
  onBookingSubmit: () => void;
}

const BookingCardComponent = ({
  pricePerNight,
  maxGuests,
  propertyId,
  dates,
  guests,
  isLoading,
  minDate,
  onDatesChange,
  onGuestsChange,
  onBookingSubmit,
}: BookingCardProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Only query when necessary dates are provided
  const shouldCheckAvailability = !!(propertyId && dates.checkIn && dates.checkOut);
  
  const { data: availabilityData, isLoading: checkingAvailability } = useQuery({
    queryKey: ['availability', propertyId, dates.checkIn, dates.checkOut],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('property_id', propertyId)
        .neq('status', 'canceled')
        .or(`check_in.lte.${dates.checkOut},check_out.gte.${dates.checkIn}`);
      
      if (error) {
        console.error("Error checking availability:", error);
        throw error;
      }
      
      return { 
        available: data?.length === 0,
        conflictingDates: data 
      };
    },
    enabled: shouldCheckAvailability,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  useEffect(() => {
    if (availabilityData) {
      setIsAvailable(availabilityData.available);
    }
  }, [availabilityData]);
  
  // Calculate total price with memoization
  const { numberOfNights, totalPrice } = useMemo(() => {
    const nights = dates.checkIn && dates.checkOut 
      ? differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))
      : 0;
    
    return {
      numberOfNights: nights,
      totalPrice: nights * pricePerNight
    };
  }, [dates.checkIn, dates.checkOut, pricePerNight]);

  return (
    <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-gray-800">₹{pricePerNight.toLocaleString('en-IN')}</span>
        <span className="text-gray-500">per night</span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center border rounded-lg p-3">
          <Calendar className="w-5 h-5 text-red-500 mr-2" />
          <Input
            type="date"
            min={minDate}
            value={dates.checkIn}
            onChange={(e) => onDatesChange({ ...dates, checkIn: e.target.value })}
            className="border-none focus:outline-none"
            placeholder="mm/dd/yyyy"
          />
        </div>
        <div className="flex items-center border rounded-lg p-3">
          <Calendar className="w-5 h-5 text-red-500 mr-2" />
          <Input
            type="date"
            min={dates.checkIn || minDate}
            value={dates.checkOut}
            onChange={(e) => onDatesChange({ ...dates, checkOut: e.target.value })}
            className="border-none focus:outline-none"
            placeholder="mm/dd/yyyy"
          />
        </div>
        <div className="flex items-center border rounded-lg p-3">
          <User className="w-5 h-5 text-red-500 mr-2" />
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
        
        {dates.checkIn && dates.checkOut && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {isAvailable ? (
              <>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Available for these dates</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Not available for these dates</span>
              </>
            )}
            {checkingAvailability && <span className="ml-2 text-xs">(Checking...)</span>}
          </div>
        )}
      </div>

      {dates.checkIn && dates.checkOut && numberOfNights > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>₹{pricePerNight.toLocaleString('en-IN')} × {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      <Button 
        className="w-full bg-red-500 hover:bg-red-600 text-white py-4 h-auto text-lg font-medium"
        onClick={onBookingSubmit}
        disabled={isLoading || !isAvailable || checkingAvailability || !dates.checkIn || !dates.checkOut}
      >
        {isLoading ? "Confirming..." : !isAvailable ? "Not Available" : "Reserve Now"}
      </Button>
    </div>
  );
};

// Export a memoized version of the component
export const BookingCard = memo(BookingCardComponent);
