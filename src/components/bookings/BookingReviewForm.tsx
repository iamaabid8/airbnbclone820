
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";

interface ReviewFormProps {
  bookingId: string;
  propertyId: string;
  userId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

export function BookingReviewForm({ 
  bookingId,
  propertyId,
  userId,
  propertyTitle,
  onSuccess
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      comment: ""
    }
  });

  const reviewMutation = useMutation({
    mutationFn: (data: { comment: string }) => {
      return reviewService.submitReview({
        property_id: propertyId,
        booking_id: bookingId,
        rating,
        comment: data.comment,
        user_id: userId
      });
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for sharing your experience!"
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['hasReviewed', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['propertyReviews', propertyId] });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: { comment: string }) => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting",
        variant: "destructive"
      });
      return;
    }
    
    reviewMutation.mutate(data);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-medium text-lg mb-2">Rate your stay at {propertyTitle}</h3>
      
      <div className="flex mb-4 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-colors ${
              (hoveredRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Textarea
            placeholder="Share details of your experience (optional)"
            className="resize-none"
            {...register("comment")}
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={reviewMutation.isPending}
          className="w-full"
        >
          {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}
