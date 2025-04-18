
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }

    try {
      await reviewService.submitReview({
        property_id: propertyId,
        user_id: userId,
        rating,
        comment: comment.trim()
      });

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!"
      });

      // Reset form
      setRating(0);
      setComment("");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer ${
              rating >= star 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            }`}
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      
      <Textarea
        placeholder="Write your review (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full min-h-[100px]"
      />
      
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={rating === 0}
      >
        Submit Review
      </Button>
    </div>
  );
}
