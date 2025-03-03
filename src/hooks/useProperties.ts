
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { PropertyFilters } from "@/components/PropertySearch";

export type Property = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  images: string[] | null;
  owner_id: string | null;
  created_at: string;
  price_per_night: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  rating: number;
  total_ratings: number;
};

export function useProperties(filters: PropertyFilters | null, selectedCategory: string | null) {
  const { toast } = useToast();
  
  const { data: properties, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', filters, selectedCategory],
    queryFn: async () => {
      console.log("Fetching properties with filters:", filters);
      console.log("Selected category:", selectedCategory);
      
      try {
        let query = supabase
          .from('properties')
          .select('*')
          .gt('price_per_night', 0);

        if (filters) {
          if (filters.location) {
            query = query.ilike('location', `%${filters.location}%`);
          }
          if (filters.propertyType && filters.propertyType !== 'All types') {
            query = query.eq('property_type', filters.propertyType);
          }
          if (filters.priceRange) {
            query = query
              .gte('price_per_night', filters.priceRange[0])
              .lte('price_per_night', filters.priceRange[1]);
          }
          if (filters.minRating > 0) {
            query = query.gte('rating', filters.minRating);
          }
          if (filters.amenities && filters.amenities.length > 0) {
            query = query.contains('amenities', filters.amenities);
          }
          if (filters.guests > 1) {
            query = query.gte('max_guests', filters.guests);
          }
        }

        if (selectedCategory) {
          query = query.eq('property_type', selectedCategory);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching properties:", error);
          throw error;
        }
        
        console.log("Fetched properties:", data?.length || 0);
        return data as Property[];
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (error) {
      console.error("Error in properties query:", error);
      toast({
        title: "Error loading properties",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return { properties: properties || [], isLoading, error, refetch };
}
