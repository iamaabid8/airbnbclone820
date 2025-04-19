
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/reviewService";

type Property = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  images: string[] | null;
  price_per_night: number;
  amenities: string[];
  property_type: string;
  rating: number | null;
  total_ratings: number | null;
};

// Define a type for the review data structure
type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string | null;
    avatar_url: string | null;
  } | null;
};

export const PropertyCard = ({ property }: { property: Property }) => {
  const defaultImage = "https://images.unsplash.com/photo-1487958449943-2429e8be8625";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultImage;
  };

  const imageUrl = property.images?.[0] || defaultImage;

  // Fetch the most recent review for this property
  const { data: recentReview } = useQuery<Review | null>({
    queryKey: ['recentReview', property.id],
    queryFn: async () => {
      const reviews = await reviewService.getPropertyReviews(property.id);
      return reviews?.[0] || null;
    },
    enabled: !!property.id && property.total_ratings !== null && property.total_ratings > 0,
  });

  return (
    <div className="property-card rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
        {property.rating !== null && property.total_ratings !== null && (
          <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-airbnb-dark flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{property.rating.toFixed(1)}</span>
            <span className="text-gray-500">({property.total_ratings})</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-airbnb-dark">
          {property.property_type}
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-airbnb-dark mb-2">
              {property.title}
            </h3>
            <p className="text-airbnb-light flex items-center">
              <span className="inline-block mr-2 text-pink-500">📍</span>
              {property.location}
            </p>
            {property.amenities && property.amenities.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {property.amenities.slice(0, 3).join(" · ")}
                {property.amenities.length > 3 && " · ..."}
              </p>
            )}
            {recentReview && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">{recentReview.profiles?.name || 'Guest'}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{recentReview.comment}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-airbnb-dark">
            <span className="font-semibold">₹{property.price_per_night.toLocaleString('en-IN')}</span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </p>
          <Link to={`/property/${property.id}`}>
            <Button variant="outline" className="hover:bg-airbnb-primary hover:text-white transition-colors">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
