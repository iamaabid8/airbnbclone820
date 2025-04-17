
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing property reviews
 */
export const reviewService = {
  /**
   * Get reviews for a property
   * @param propertyId The ID of the property
   */
  getPropertyReviews: async (propertyId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        user_id,
        profiles:user_id (name, avatar_url)
      `)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Check if a user has already reviewed a booking
   * @param bookingId The ID of the booking
   */
  hasReviewedBooking: async (bookingId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .single();
      
    if (error && error.code !== 'PGSQL_ERROR_NO_DATA_FOUND') throw error;
    return !!data;
  },
  
  /**
   * Submit a review for a property
   * @param review The review data
   */
  submitReview: async (review: {
    property_id: string;
    booking_id: string;
    rating: number;
    comment?: string;
    user_id: string;
  }) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};
