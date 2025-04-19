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
      .insert({ 
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate 
      })
      .select();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Check if a property is available for specific dates
   */
  checkAvailability: async (propertyId: string, startDate: string, endDate: string) => {
    // Only check for non-canceled bookings that overlap with the requested dates
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('property_id', propertyId)
      .eq('status', 'confirmed') // Only check confirmed bookings
      .or(`check_in.lte.${endDate},check_out.gte.${startDate}`);
      
    if (error) throw error;
    return data.length === 0; // Property is available if no overlapping bookings found
  },
  
  /**
   * Remove an availability period (e.g., when booking is canceled)
   */
  removeAvailabilityPeriod: async (bookingId: string) => {
    // We don't need to manually remove availability periods anymore
    // This is handled by the trigger we created in the database
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'canceled' })
      .eq('id', bookingId)
      .select();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Subscribe to availability changes for a property
   */
  subscribeToAvailabilityChanges: (propertyId: string, callback: (payload: any) => void) => {
    // Subscribe to both bookings and property changes
    const channel = supabase
      .channel(`property-${propertyId}-availability`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `property_id=eq.${propertyId}`
        },
        callback
      )
      .subscribe();
      
    return channel;
  }
};
