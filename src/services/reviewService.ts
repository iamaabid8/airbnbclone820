
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing property reviews with performance optimizations
 */
export const reviewService = {
  /**
   * Get reviews for a property with optimized field selection
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
   * Subscribe to real-time updates for property reviews
   * @param propertyId The ID of the property
   * @param callback Function to call when reviews are updated
   */
  subscribeToPropertyReviews: (propertyId: string, callback: () => void) => {
    const channel = supabase
      .channel('public:reviews:property_id=eq.' + propertyId)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reviews',
          filter: `property_id=eq.${propertyId}` 
        }, 
        () => {
          callback();
        }
      )
      .subscribe();

    return channel;
  },

  /**
   * Check if a user has already reviewed a property with optimized query
   * @param propertyId The ID of the property
   * @param userId The ID of the user
   */
  hasUserReviewedProperty: async (propertyId: string, userId: string) => {
    const { count, error } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('property_id', propertyId)
      .eq('user_id', userId);
      
    if (error) throw error;
    return count !== null && count > 0;
  },
  
  /**
   * Check if a user has already reviewed a booking
   * @param bookingId The ID of the booking
   */
  hasReviewedBooking: async (bookingId: string) => {
    const { count, error } = await supabase
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('booking_id', bookingId);
      
    if (error) throw error;
    return count !== null && count > 0;
  },
  
  /**
   * Submit a review for a property
   * @param review The review data
   */
  submitReview: async (review: {
    property_id: string;
    booking_id?: string;
    rating: number;
    comment?: string;
    user_id: string;
  }) => {
    // If booking_id is not provided, use an empty string as the default
    // to satisfy the database constraint
    const reviewData = {
      ...review,
      booking_id: review.booking_id || '00000000-0000-0000-0000-000000000000' // Using a default UUID
    };
    
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  /**
   * Get completed bookings that can be reviewed with optimized query
   * @param userId The ID of the user
   * @param propertyId The ID of the property
   */
  getReviewableBookings: async (userId: string, propertyId: string) => {
    const now = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('bookings')
      .select('id, check_in, check_out')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .lt('check_out', now) // Only past bookings
      .eq('status', 'confirmed')
      .order('check_out', { ascending: false });
      
    if (error) throw error;
    
    // For each booking, check if it has been reviewed already
    // We use Promise.all to make parallel requests for performance
    const reviewStatusPromises = data?.map(async (booking) => {
      const hasReviewed = await reviewService.hasReviewedBooking(booking.id);
      return { booking, hasReviewed };
    }) || [];
    
    const reviewStatuses = await Promise.all(reviewStatusPromises);
    
    // Filter out bookings that have already been reviewed
    const reviewableBookings = reviewStatuses
      .filter(status => !status.hasReviewed)
      .map(status => status.booking);
    
    return reviewableBookings;
  }
};
