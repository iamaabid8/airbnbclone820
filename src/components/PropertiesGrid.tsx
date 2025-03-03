
import React from "react";
import { PropertyCard } from "./PropertyCard";
import type { PropertyFilters } from "./PropertySearch";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { PropertyAdminView } from "./property/PropertyAdminView";
import { PropertySkeleton } from "./property/PropertySkeleton";
import { NoPropertiesFound } from "./property/NoPropertiesFound";
import { usePropertyAvailability } from "@/hooks/usePropertyAvailability";
import { useCurrentUser } from "@/hooks/useCurrentUser";

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
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  owner_id: string | null;
}

interface PropertiesGridProps {
  properties: Property[] | undefined;
  isLoading: boolean;
  selectedCategory: string | null;
  filters: PropertyFilters | null;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export const PropertiesGrid = ({ 
  properties, 
  isLoading, 
  selectedCategory, 
  filters,
  isAdmin = false,
  onDelete
}: PropertiesGridProps) => {
  const { currentUserId } = useCurrentUser();
  
  // Get property IDs for availability checking
  const propertyIds = properties?.map(p => p.id) || [];
  
  // Use custom hook to check availability
  const { availabilityMap } = usePropertyAvailability(propertyIds);

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // Render the title section based on filters and categories
  const renderTitle = () => (
    <h2 className="text-3xl font-bold text-airbnb-dark mb-12">
      {filters ? 'Search Results' : selectedCategory ? `${selectedCategory}` : 'Featured places to stay'}
    </h2>
  );

  // Render loading skeletons
  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <PropertySkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );

  // Render properties grid
  const renderPropertiesGrid = () => {
    if (!properties || properties.length === 0) {
      return <NoPropertiesFound />;
    }

    return (
      <div className={`grid gap-6 ${isAdmin ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {properties.map((property) => (
          isAdmin ? (
            <div key={property.id}>
              <PropertyAdminView 
                property={property} 
                isAvailable={availabilityMap[property.id] !== false}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div key={property.id} className="relative">
              <PropertyCard 
                property={property} 
                isAvailable={availabilityMap[property.id] !== false}
              />
              {/* Only show delete button if user is admin and they own the property */}
              {isAdmin && property.owner_id === currentUserId && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => handleDelete(property.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto">
        {renderTitle()}
        {isLoading ? renderLoadingState() : renderPropertiesGrid()}
      </div>
    </section>
  );
};
