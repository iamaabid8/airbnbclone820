
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookingService } from "@/services/bookingService";

interface BookingReviewCardProps {
  booking: {
    id: string;
    check_in: string;
    check_out: string;
    property_id: string;
    user_id: string;
    status: string;
    properties: {
      title: string;
      location: string;
      images?: string[] | null;
    };
  };
}

export const BookingReviewCard = ({ booking }: BookingReviewCardProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsLoading(true);
      try {
        // Check if the booking is completed
        const completed = await bookingService.isBookingCompleted(booking.id);
        setIsCompleted(completed);
      } catch (error) {
        console.error("Error checking booking status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStatus();
  }, [booking.id]);
  
  if (!isCompleted || booking.status === 'canceled') {
    return null; // Don't show for non-completed or canceled bookings
  }

  return (
    <Card className="mb-4 border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{booking.properties.title}</h3>
            <p className="text-sm text-gray-600">{booking.properties.location}</p>
            <p className="text-sm text-gray-600">
              {format(new Date(booking.check_in), "MMM d, yyyy")} - {format(new Date(booking.check_out), "MMM d, yyyy")}
            </p>
          </div>
          {booking.properties.images && booking.properties.images.length > 0 && (
            <div className="h-16 w-16 rounded-md overflow-hidden">
              <img
                src={booking.properties.images[0]}
                alt={booking.properties.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-green-100/50 flex justify-between items-center">
        <div className="text-green-700 text-sm font-medium">
          Your stay is completed
        </div>
        <div>
          {!isLoading && (
            <Button variant="outline" className="border-green-500 text-green-700">
              Completed
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
