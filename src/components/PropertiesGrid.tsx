
import { ImageOff, Edit, Trash2 } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import type { PropertyFilters } from "./PropertySearch";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { AvailabilityBadge } from "./property/AvailabilityBadge";
import { addDays, isWithinInterval } from "date-fns";

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});

  // Fetch the current user session when component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          return;
        }
        
        // Set the user ID if a session exists
        if (data.session) {
          setCurrentUserId(data.session.user.id);
        } else {
          setCurrentUserId(null);
        }
      } catch (error) {
        console.error("Unexpected error fetching session:", error);
      }
    };
    
    fetchSession();
  }, []);

  // Fetch availability status for all properties
  useEffect(() => {
    const checkAvailability = async () => {
      if (!properties || properties.length === 0) return;
      
      const propertyIds = properties.map(p => p.id);
      const today = new Date();
      const nextWeek = addDays(today, 7);
      
      // Get all bookings for the properties
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('property_id, check_in, check_out')
        .in('property_id', propertyIds)
        .eq('status', 'confirmed');
      
      if (error) {
        console.error("Error fetching bookings:", error);
        return;
      }
      
      // Create availability map
      const availabilityStatus: Record<string, boolean> = {};
      
      // Initialize all properties as available
      propertyIds.forEach(id => {
        availabilityStatus[id] = true;
      });
      
      // Check for bookings in the next week
      bookings?.forEach(booking => {
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        
        // If booking overlaps with next week, mark property as unavailable
        if (
          (checkIn <= nextWeek && checkOut >= today) ||
          isWithinInterval(today, { start: checkIn, end: checkOut }) ||
          isWithinInterval(nextWeek, { start: checkIn, end: checkOut })
        ) {
          availabilityStatus[booking.property_id] = false;
        }
      });
      
      setAvailabilityMap(availabilityStatus);
    };
    
    checkAvailability();
  }, [properties]);

  const handleDelete = async (id: string) => {
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
  };

  const renderAdminView = (property: Property) => {
    // Format price consistently using Indian locale and ₹ symbol
    const formattedPrice = property.price_per_night.toLocaleString('en-IN');
    const isAvailable = availabilityMap[property.id] !== false;
    
    return (
      <div key={property.id} className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4">
          <div className="w-40 h-32 relative">
            <img
              src={property.images?.[0] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <AvailabilityBadge 
              isAvailable={isAvailable} 
              className="top-1 left-1 text-xs px-2 py-0.5"
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
                  onClick={() => handleDelete(property.id)}
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
                ₹{formattedPrice}/night
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
  };

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
              isAdmin ? renderAdminView(property) : (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
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
