
import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { toast } from "@/components/ui/use-toast";
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

interface PropertyAdminViewProps {
  property: Property;
  isAvailable: boolean;
  onDelete?: (id: string) => void;
}

export const PropertyAdminView = ({ property, isAvailable, onDelete }: PropertyAdminViewProps) => {
  // Format price consistently using Indian locale and ₹ symbol
  const formattedPrice = property.price_per_night.toLocaleString('en-IN');
  
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });

      if (onDelete) {
        onDelete(property.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete property: " + error.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
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
