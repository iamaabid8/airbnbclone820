
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingReviewForm } from "./BookingReviewForm";
import { bookingService } from "@/services/bookingService";
import { reviewService } from "@/services/reviewService";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingReviewCardProps {
  booking: {
    id: string;
    property_id: string;
    check_in: string;
    check_out: string;
    properties: {
      title: string;
    };
  };
  userId: string;
}

export function BookingReviewCard({ booking, userId }: BookingReviewCardProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { data: hasReviewed, isLoading: isCheckingReview } = useQuery({
    queryKey: ['hasReviewed', booking.id],
    queryFn: () => reviewService.hasReviewedBooking(booking.id),
  });

  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const completed = await bookingService.isBookingCompleted(booking.id);
        setIsCompleted(completed);
      } catch (error) {
        console.error("Error checking booking completion:", error);
      }
    };

    checkCompletion();
  }, [booking.id]);

  if (!isCompleted) {
    return null;
  }

  if (isCheckingReview) {
    return (
      <Card className="mb-4 bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasReviewed) {
    return (
      <Card className="mb-4 bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{booking.properties.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(booking.check_in).toLocaleDateString()} to {new Date(booking.check_out).toLocaleDateString()}
              </p>
            </div>
            <div className="text-sm text-green-600 font-medium">
              Review submitted ✓
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        {!showReviewForm ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{booking.properties.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(booking.check_in).toLocaleDateString()} to {new Date(booking.check_out).toLocaleDateString()}
              </p>
            </div>
            <Button onClick={() => setShowReviewForm(true)}>
              Leave a Review
            </Button>
          </div>
        ) : (
          <BookingReviewForm
            bookingId={booking.id}
            propertyId={booking.property_id}
            userId={userId}
            propertyTitle={booking.properties.title}
            onSuccess={() => setShowReviewForm(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
