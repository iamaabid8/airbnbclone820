
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { addDays, isWithinInterval } from "date-fns";

/**
 * Custom hook to check availability status for a list of properties
 */
export function usePropertyAvailability(propertyIds: string[] | undefined) {
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!propertyIds || propertyIds.length === 0) return;
      
      setIsLoading(true);
      const today = new Date();
      const nextWeek = addDays(today, 7);
      
      console.log("Checking availability for properties:", propertyIds);
      
      // Get all bookings for the properties
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('property_id, check_in, check_out')
        .in('property_id', propertyIds)
        .eq('status', 'confirmed');
      
      if (error) {
        console.error("Error fetching bookings:", error);
        setIsLoading(false);
        return;
      }
      
      console.log("Bookings data:", bookings);
      
      // Create availability map
      const availabilityStatus: Record<string, boolean> = {};
      
      // Initialize all properties as available
      propertyIds.forEach(id => {
        availabilityStatus[id] = true;
      });
      
      // Check for bookings in the next week
      bookings?.forEach(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        
        // If booking overlaps with next week, mark property as unavailable
        if (
          (checkIn <= nextWeek && checkOut >= today) ||
          isWithinInterval(today, { start: checkIn, end: checkOut }) ||
          isWithinInterval(nextWeek, { start: checkIn, end: checkOut })
        ) {
          availabilityStatus[booking.property_id] = false;
        }
      });
      
      console.log("Availability status:", availabilityStatus);
      setAvailabilityMap(availabilityStatus);
      setIsLoading(false);
    };
    
    checkAvailability();
  }, [propertyIds]);

  return { availabilityMap, isLoading };
}
