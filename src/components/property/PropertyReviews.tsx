
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PropertyReviewsProps {
  propertyId: string;
  refreshTrigger?: number;
}

export const PropertyReviews = ({ propertyId, refreshTrigger = 0 }: PropertyReviewsProps) => {
  const { data: totalReviews, isLoading } = useQuery({
    queryKey: ['totalReviews', propertyId, refreshTrigger],
    queryFn: async () => {
      // Fixed the issue with count query by specifying count 'exact' and using `head: true`
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', propertyId);
        
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="mt-8">
      <div className="border-t pt-8">
        <h2 className="text-2xl font-semibold mb-6">
          Reviews {!isLoading && `(${totalReviews})`}
        </h2>
        <ReviewsList propertyId={propertyId} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};
