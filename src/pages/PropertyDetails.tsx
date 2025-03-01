
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format, addDays, parseISO } from "date-fns";
import { PropertyNavigation } from "@/components/property/PropertyNavigation";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyImages } from "@/components/property/PropertyImages";
import { PropertyInfo } from "@/components/property/PropertyInfo";
import { BookingCard } from "@/components/property/BookingCard";

const PropertyDetails = () => {
  const { id } = useParams();
  const [guests, setGuests] = useState(1);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }
      return data;
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

  // Check availability mutation with more robust checking
  const checkAvailabilityMutation = useMutation({
    mutationFn: async (bookingDates: { checkIn: string; checkOut: string }) => {
      console.log("Checking availability for dates:", bookingDates);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('check_in, check_out')
        .eq('property_id', id)
        .eq('status', 'confirmed');
        
      if (error) {
        console.error("Error checking availability:", error);
        throw error;
      }
      
      // Prepare dates for conflict checking
      const checkInDate = new Date(bookingDates.checkIn);
      const checkOutDate = new Date(bookingDates.checkOut);
      
      console.log("Existing bookings:", data);
      
      // Generate array of all dates in the requested booking
      const requestedDates: string[] = [];
      const currentDate = new Date(checkInDate);
      while (currentDate <= checkOutDate) {
        requestedDates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Check if any of the requested dates are already booked
      for (const booking of data) {
        const bookedCheckIn = new Date(booking.check_in);
        const bookedCheckOut = new Date(booking.check_out);
        
        // Generate array of all booked dates
        const bookedDates: string[] = [];
        const currentBookedDate = new Date(bookedCheckIn);
        while (currentBookedDate <= bookedCheckOut) {
          bookedDates.push(format(currentBookedDate, 'yyyy-MM-dd'));
          currentBookedDate.setDate(currentBookedDate.getDate() + 1);
        }
        
        // Check for overlap between requested dates and booked dates
        const conflict = requestedDates.some(date => bookedDates.includes(date));
        
        if (conflict) {
          console.log("Booking conflict detected");
          return { isAvailable: false, conflictDates: bookedDates };
        }
      }
      
      console.log("Dates are available");
      return { isAvailable: true };
    }
  });

  const bookingMutation = useMutation({
    mutationFn: async (bookingData: {
      property_id: string;
      check_in: string;
      check_out: string;
      total_price: number;
      user_id: string;
    }) => {
      // First check availability
      const availability = await checkAvailabilityMutation.mutateAsync({
        checkIn: bookingData.check_in,
        checkOut: bookingData.check_out
      });
      
      if (!availability.isAvailable) {
        throw new Error("These dates are no longer available. Please select different dates.");
      }
      
      // If available, proceed with booking
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          ...bookingData,
          status: 'confirmed' // Auto-confirm the booking
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Also invalidate property query to refresh availability data
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      
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

    // Perform final availability check before processing
    try {
      const availabilityResult = await checkAvailabilityMutation.mutateAsync({
        checkIn: dates.checkIn,
        checkOut: dates.checkOut
      });
      
      if (!availabilityResult.isAvailable) {
        toast({
          title: "Dates unavailable",
          description: "Selected dates are no longer available. Please choose different dates.",
          variant: "destructive",
        });
        return;
      }
      
      // Calculate the total price
      const numberOfNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalPrice = numberOfNights * property.price_per_night;
  
      // Process the booking
      bookingMutation.mutate({
        property_id: property.id,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        total_price: totalPrice,
        user_id: session.user.id,
      });
    } catch (error) {
      console.error("Availability check failed:", error);
      toast({
        title: "Error",
        description: "Could not verify availability. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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
          rating={property.rating}
          totalRatings={property.total_ratings}
          location={property.location}
        />

        <PropertyImages images={property.images} title={property.title} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <PropertyInfo
              description={property.description}
              amenities={property.amenities}
            />
          </div>

          <div className="md:col-span-1">
            <BookingCard
              pricePerNight={property.price_per_night}
              maxGuests={property.max_guests}
              dates={dates}
              guests={guests}
              isLoading={bookingMutation.isPending || checkAvailabilityMutation.isPending}
              minDate={tomorrow}
              propertyId={property.id}
              onDatesChange={setDates}
              onGuestsChange={setGuests}
              onBookingSubmit={handleBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
