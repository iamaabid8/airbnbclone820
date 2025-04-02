
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";

interface ReviewDialogProps {
  bookingId: string;
  propertyId: string;
  userId: string;
  propertyName: string;
  onReviewSubmitted?: () => void;
  children?: React.ReactNode;
}

export const ReviewDialog = ({
  bookingId,
  propertyId,
  userId,
  propertyName,
  onReviewSubmitted,
  children,
}: ReviewDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: hasReviewed, refetch } = useQuery({
    queryKey: ['hasReviewed', bookingId],
    queryFn: async () => {
      return await reviewService.hasReviewed(bookingId);
    },
    refetchOnWindowFocus: false,
  });

  const handleReviewSubmit = () => {
    setIsOpen(false);
    refetch();
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            className="w-full"
            disabled={hasReviewed}
          >
            {hasReviewed ? "Already Reviewed" : "Leave a Review"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Your Stay</DialogTitle>
          <DialogDescription>
            Share your experience at {propertyName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ReviewForm
            bookingId={bookingId}
            propertyId={propertyId}
            userId={userId}
            onSubmit={handleReviewSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
