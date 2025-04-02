
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
      .rpc('add_property_availability', { 
        p_property_id: propertyId,
        p_start_date: startDate,
        p_end_date: endDate,
      });
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Check if a property is available for specific dates
   */
  checkAvailability: async (propertyId: string, startDate: string, endDate: string) => {
    // We need to check if there are any overlapping availability periods
    // that would make these dates unavailable
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('property_id', propertyId)
      .gte('check_out', startDate)
      .lte('check_in', endDate)
      .neq('status', 'canceled');
      
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
