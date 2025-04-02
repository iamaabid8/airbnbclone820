
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { reviewService } from "@/services/reviewService";

interface ReviewFormProps {
  bookingId: string;
  propertyId: string;
  userId: string;
  onSubmit?: () => void;
  currentRating?: number;
  currentComment?: string;
  reviewId?: string;
  isEditing?: boolean;
}

export const ReviewForm = ({
  bookingId,
  propertyId,
  userId,
  onSubmit,
  currentRating = 0,
  currentComment = "",
  reviewId,
  isEditing = false,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(currentRating);
  const [comment, setComment] = useState(currentComment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && reviewId) {
        await reviewService.updateReview(reviewId, rating, comment);
        toast({
          title: "Review updated",
          description: "Your review has been updated successfully",
        });
      } else {
        await reviewService.createReview(bookingId, propertyId, userId, rating, comment);
        toast({
          title: "Review submitted",
          description: "Thank you for your feedback!",
        });
      }
      
      if (onSubmit) onSubmit();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Your Rating</h3>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  rating >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="comment" className="text-lg font-medium">
          Your Review
        </label>
        <Textarea
          id="comment"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : isEditing ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
};
