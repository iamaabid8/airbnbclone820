
import { memo, useCallback } from "react";
import { ImageOff, Edit, Trash2 } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import type { PropertyFilters } from "./PropertySearch";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

// Create a memo component for the admin view to prevent unnecessary rerenders
const AdminPropertyCard = memo(({ 
  property, 
  onDelete 
}: { 
  property: Property; 
  onDelete: (id: string) => void 
}) => {
  const handleDelete = useCallback(() => {
    onDelete(property.id);
  }, [property.id, onDelete]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex gap-4">
        <div className="w-40 h-32">
          <img
            src={property.images?.[0] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy" // Add lazy loading for images
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
              <p className="text-sm text-gray-500">{property.location}</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Price:</span>
              <br />
              ₹{property.price_per_night.toLocaleString('en-IN')}/night
            </div>
            <div>
              <span className="font-medium">Type:</span>
              <br />
              {property.property_type}
            </div>
            <div>
              <span className="font-medium">Rooms:</span>
              <br />
              {property.bedrooms}B {property.bathrooms}BA
            </div>
            <div>
              <span className="font-medium">Guests:</span>
              <br />
              Max {property.max_guests}
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm font-medium">Amenities:</span>
            <p className="text-sm text-gray-500">
              {property.amenities?.slice(0, 5).join(", ")}
              {property.amenities && property.amenities.length > 5 ? "..." : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

const PropertiesGridComponent = ({ 
  properties, 
  isLoading, 
  selectedCategory, 
  filters,
  isAdmin = false,
  onDelete
}: PropertiesGridProps) => {
  const handleDelete = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });

      if (onDelete) {
        onDelete(id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete property: " + error.message,
        variant: "destructive",
      });
    }
  }, [onDelete]);

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-airbnb-dark mb-12">
          {filters ? 'Search Results' : selectedCategory ? `${selectedCategory}` : 'Featured places to stay'}
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className={`grid gap-6 ${isAdmin ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {properties.map((property) => (
              isAdmin ? (
                <AdminPropertyCard 
                  key={property.id}
                  property={property}
                  onDelete={handleDelete}
                />
              ) : (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
                </div>
              )
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

// Export the memoized component
export const PropertiesGrid = memo(PropertiesGridComponent);
