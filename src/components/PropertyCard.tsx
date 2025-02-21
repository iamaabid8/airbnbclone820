
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Property = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  images: string[] | null;
  price_per_night: number;
  rating: number;
  total_ratings: number;
  amenities: string[];
  property_type: string;
};

export const PropertyCard = ({ property }: { property: Property }) => {
  // Convert USD to INR (approximately)
  const priceInRupees = Math.round(property.price_per_night * 83); // Using approximate conversion rate

  return (
    <div className="property-card rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-200 relative">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1487958449943-2429e8be8625"}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
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
              <span className="inline-block mr-2">📍</span>
              {property.location}
            </p>
            {property.amenities && property.amenities.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {property.amenities.slice(0, 3).join(" · ")}
                {property.amenities.length > 3 && " · ..."}
              </p>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-airbnb-dark">{property.rating || "New"}</span>
            {property.total_ratings > 0 && (
              <span className="text-sm text-muted-foreground ml-1">
                ({property.total_ratings})
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-airbnb-dark">
            <span className="font-semibold">₹{priceInRupees.toLocaleString('en-IN')}</span>
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
