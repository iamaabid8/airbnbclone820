
import { ImageOff } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import type { PropertyFilters } from "./PropertySearch";

interface Property {
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
}

interface PropertiesGridProps {
  properties: Property[] | undefined;
  isLoading: boolean;
  selectedCategory: string | null;
  filters: PropertyFilters | null;
}

export const PropertiesGrid = ({ properties, isLoading, selectedCategory, filters }: PropertiesGridProps) => {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-airbnb-dark mb-12">
          {filters ? 'Search Results' : selectedCategory ? `${selectedCategory}` : 'Featured places to stay'}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-video bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageOff className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">No properties found</p>
          </div>
        )}
      </div>
    </section>
  );
};
