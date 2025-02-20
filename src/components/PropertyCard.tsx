
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
};

export const PropertyCard = ({ property }: { property: Property }) => {
  return (
    <div className="property-card rounded-xl overflow-hidden bg-white">
      <div className="aspect-video bg-gray-200 relative">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-airbnb-dark mb-2">
              {property.title}
            </h3>
            <p className="text-airbnb-light">{property.location}</p>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-airbnb-dark">{property.rating || "New"}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-airbnb-dark">
            <span className="font-semibold">${property.price_per_night}</span> / night
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
