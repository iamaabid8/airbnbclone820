import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format, addDays } from "date-fns";
import { PropertyNavigation } from "@/components/property/PropertyNavigation";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyImages } from "@/components/property/PropertyImages";
import { PropertyInfo } from "@/components/property/PropertyInfo";
import { BookingCard } from "@/components/property/BookingCard";
import { HostContactInfo } from "@/components/property/HostContactInfo";
import { reviewService } from "@/services/reviewService";
import { Star, StarHalf } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PropertyDetails = () => {
  const { id } = useParams();
  const [guests, setGuests] = useState(1);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log("Current property ID:", id); // Debug log

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      console.log("Fetching property with ID:", id); // Debug log
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      console.log("Supabase response:", { data, error }); // Debug log

      if (error) {
        console.error("Supabase error:", error); // Debug log
        throw error;
      }
      return data;
    },
    enabled: !!id,
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['propertyReviews', id],
    queryFn: async () => {
      if (!id) return [];
      return reviewService.getPropertyReviews(id);
    },
    enabled: !!id,
  });

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: {
      property_id: string;
      check_in: string;
      check_out: string;
      total_price: number;
      user_id: string;
      guests: number;
    }) => {
      // Check for existing bookings that overlap with these dates
      const { data: existingBookings, error: checkError } = await supabase
        .from('bookings')
        .select('*')
        .eq('property_id', bookingData.property_id)
        .neq('status', 'canceled')
        .or(`check_in.lte.${bookingData.check_out},check_out.gte.${bookingData.check_in}`);
        
      if (checkError) throw checkError;
      
      // If there are overlapping bookings, the property is not available
      if (existingBookings && existingBookings.length > 0) {
        throw new Error('Property is not available for the selected dates');
      }
      
      // Create the booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'availability'] });
      toast({
        title: "Booking confirmed!",
        description: "Your reservation has been successfully made.",
      });
      navigate('/profile');
    },
    onError: (error: any) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBooking = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make a booking",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!dates.checkIn || !dates.checkOut) {
      toast({
        title: "Select dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    const checkInDate = new Date(dates.checkIn);
    const checkOutDate = new Date(dates.checkOut);
    
    if (checkInDate <= new Date()) {
      toast({
        title: "Invalid dates",
        description: "Check-in date must be in the future",
        variant: "destructive",
      });
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast({
        title: "Invalid dates",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = numberOfNights * property.price_per_night;

    bookingMutation.mutate({
      property_id: property.id,
      check_in: dates.checkIn,
      check_out: dates.checkOut,
      total_price: totalPrice,
      user_id: session.user.id,
      guests: guests,
    });
  };

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`star-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    console.log("Loading state..."); // Debug log
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="container mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-80 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    console.log("No property found for ID:", id); // Debug log
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Property not found</h1>
        <p className="text-xl text-gray-600 mb-8">
          The property you're looking for could not be found.
        </p>
        <Link 
          to="/" 
          className="text-airbnb-primary hover:text-airbnb-dark text-lg font-semibold transition-colors"
        >
          Return to home
        </Link>
      </div>
    );
  }

  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen">
      <PropertyNavigation />

      <div className="container mx-auto pt-24 px-6">
        <PropertyHeader
          title={property.title}
          location={property.location}
        />

        <PropertyImages images={property.images} title={property.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <PropertyInfo
              description={property.description}
              amenities={property.amenities}
            />
            
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-airbnb-dark">
                  Reviews
                </h2>
                <div className="flex items-center gap-2">
                  {renderStarRating(property.rating || 0)}
                  <span className="text-gray-500">({property.total_ratings || 0} reviews)</span>
                </div>
              </div>
              
              <Separator className="mb-6" />
              
              {isLoadingReviews ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-1/3" />
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                  ))}
                </div>
              ) : reviews && reviews.length > 0 ? (
                <div className="space-y-8">
                  {reviews.map((review: any) => (
                    <Card key={review.id} className="border-none shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.profiles?.avatar_url} alt={review.profiles?.name || 'Guest'} />
                            <AvatarFallback>
                              {(review.profiles?.name || 'G')[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{review.profiles?.name || 'Guest'}</h4>
                              <div className="flex items-center">
                                {renderStarRating(review.rating)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                            {review.comment && (
                              <p className="mt-2 text-gray-600">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">
                  No reviews yet for this property.
                </p>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <BookingCard
              pricePerNight={property.price_per_night}
              maxGuests={property.max_guests}
              propertyId={property.id}
              dates={dates}
              guests={guests}
              isLoading={bookingMutation.isPending}
              minDate={tomorrow}
              onDatesChange={setDates}
              onGuestsChange={setGuests}
              onBookingSubmit={handleBooking}
            />
            
            <HostContactInfo 
              hostId={property.owner_id || ''} 
              propertyTitle={property.title}
              isAuthenticated={!!session}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
