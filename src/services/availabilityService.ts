
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing property availability
 */
export const availabilityService = {
  /**
   * Add a new availability period for a property
   */
  addAvailabilityPeriod: async (propertyId: string, startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('property_availability')
      .insert([{ 
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
      }])
      .select();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Check if a property is available for specific dates
   */
  checkAvailability: async (propertyId: string, startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('property_availability')
      .select('*')
      .eq('property_id', propertyId)
      .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);
      
    if (error) throw error;
    return data.length === 0; // Property is available if no overlapping bookings found
  },
  
  /**
   * Remove an availability period (e.g., when booking is canceled)
   */
  removeAvailabilityPeriod: async (bookingId: string) => {
    const { data, error } = await supabase
      .from('property_availability')
      .delete()
      .eq('booking_id', bookingId);
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Subscribe to availability changes for a property
   */
  subscribeToAvailabilityChanges: (propertyId: string, callback: (payload: any) => void) => {
    const channel = supabase
      .channel(`property-${propertyId}-availability`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'property_availability',
          filter: `property_id=eq.${propertyId}`
        },
        callback
      )
      .subscribe();
      
    return channel;
  }
};
