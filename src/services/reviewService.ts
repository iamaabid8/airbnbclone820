
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing property reviews
 */
export const reviewService = {
  /**
   * Create a new review for a booking
   */
  createReview: async (bookingId: string, propertyId: string, userId: string, rating: number, comment: string) => {
    // Use 'from' with table name as a string literal - this allows TypeScript to work with tables not yet in the schema cache
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ 
        booking_id: bookingId,
        property_id: propertyId,
        user_id: userId,
        rating,
        comment 
      }])
      .select();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Check if a user has already reviewed a booking
   */
  hasReviewed: async (bookingId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .maybeSingle();
      
    if (error) throw error;
    return data !== null;
  },
  
  /**
   * Get reviews for a property
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
   * Update an existing review
   */
  updateReview: async (reviewId: string, rating: number, comment: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ rating, comment })
      .eq('id', reviewId)
      .select();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Delete a review
   */
  deleteReview: async (reviewId: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
      
    if (error) throw error;
    return true;
  }
};
