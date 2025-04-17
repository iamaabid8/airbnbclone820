
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";

interface PropertyReviewFormProps {
  propertyId: string;
  userId: string;
  onSuccess?: () => void;
}

export function PropertyReviewForm({ 
  propertyId,
  userId,
  onSuccess
}: PropertyReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      comment: ""
    }
  });

  const { data: hasReviewed, isLoading: isCheckingReview } = useQuery({
    queryKey: ['hasUserReviewed', propertyId, userId],
    queryFn: async () => {
      if (!userId) return false;
      return reviewService.hasUserReviewedProperty(propertyId, userId);
    },
    enabled: !!userId && !!propertyId,
  });

  const reviewMutation = useMutation({
    mutationFn: (data: { comment: string }) => {
      return reviewService.submitReview({
        property_id: propertyId,
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
      queryClient.invalidateQueries({ queryKey: ['propertyReviews', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['hasUserReviewed', propertyId, userId] });
      reset();
      setRating(0);
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

  if (isCheckingReview) {
    return <div className="text-center py-4">Checking review status...</div>;
  }

  if (hasReviewed) {
    return (
      <div className="p-4 text-center border rounded-lg bg-gray-50">
        <p className="text-green-600 font-medium">You've already reviewed this property</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-medium text-lg mb-2">Rate this property</h3>
      
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
