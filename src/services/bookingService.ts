
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing bookings
 */
export const bookingService = {
  /**
   * Get bookings for a user
   */
  getUserBookings: async (userId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        check_in,
        check_out,
        total_price,
        status,
        property_id,
        guests,
        properties:property_id (
          title,
          location,
          images
        )
      `)
      .eq('user_id', userId);
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Get a specific booking by ID
   */
  getBooking: async (bookingId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        check_in,
        check_out,
        total_price,
        status,
        property_id,
        guests,
        user_id
      `)
      .eq('id', bookingId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Cancel a booking
   */
  cancelBooking: async (bookingId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'canceled' })
      .eq('id', bookingId)
      .select();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Check if a booking is completed (check-out date has passed)
   */
  isBookingCompleted: async (bookingId: string) => {
    const booking = await bookingService.getBooking(bookingId);
    if (!booking) return false;
    
    const checkOutDate = new Date(booking.check_out);
    const today = new Date();
    
    // Return true if checkout date has passed and booking is not canceled
    return checkOutDate < today && booking.status !== 'canceled';
  }
};
