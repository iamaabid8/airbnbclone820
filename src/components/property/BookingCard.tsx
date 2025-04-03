import { Calendar, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { differenceInDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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
  onReviewSubmitted?: () => void;
}

export const BookingCard = ({
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
  onReviewSubmitted,
}: BookingCardProps) => {
  const priceInRupees = Math.round(pricePerNight * 83);
  const [isAvailable, setIsAvailable] = useState(true);
  
  const { data: availabilityData, isLoading: checkingAvailability } = useQuery({
    queryKey: ['availability', propertyId, dates.checkIn, dates.checkOut],
    queryFn: async () => {
      if (!dates.checkIn || !dates.checkOut) return { available: true };
      
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
    enabled: !!(propertyId && dates.checkIn && dates.checkOut),
  });
  
  useEffect(() => {
    if (!propertyId) return;
    
    const channel = supabase
      .channel('property_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `property_id=eq.${propertyId}`
        },
        (payload) => {
          console.log('Availability changed:', payload);
          if (dates.checkIn && dates.checkOut) {
            setIsAvailable(prev => !prev);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId]);
  
  useEffect(() => {
    if (availabilityData) {
      setIsAvailable(availabilityData.available);
    }
  }, [availabilityData]);

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
            onChange={(e) => onDatesChange({ ...dates, checkIn: e.target.value })}
            className="border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-lg p-3">
          <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input
            type="date"
            min={dates.checkIn || minDate}
            value={dates.checkOut}
            onChange={(e) => onDatesChange({ ...dates, checkOut: e.target.value })}
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

      {dates.checkIn && dates.checkOut && (
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
        disabled={isLoading || !isAvailable || checkingAvailability}
      >
        {isLoading ? "Confirming..." : !isAvailable ? "Not Available" : "Reserve Now"}
      </Button>
    </div>
  );
};
