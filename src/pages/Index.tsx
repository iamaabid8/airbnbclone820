
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertySearch, type PropertyFilters } from "@/components/PropertySearch";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Categories } from "@/components/Categories";
import { PropertiesGrid } from "@/components/PropertiesGrid";

type Property = {
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

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState<PropertyFilters | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', filters, selectedCategory],
    queryFn: async () => {
      console.log("Fetching properties with filters:", filters);
      let query = supabase
        .from('properties')
        .select('*');

      if (filters) {
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.propertyType) {
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
        if (filters.amenities.length > 0) {
          query = query.contains('amenities', filters.amenities);
        }
      }

      if (selectedCategory) {
        query = query.eq('property_type', selectedCategory);
      }

      const { data, error } = await query;
      
      console.log("Supabase response:", { data, error });
      
      if (error) throw error;
      return data as Property[];
    },
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSearch = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFilters(null);
  };

  return (
    <div className="min-h-screen w-full">
      <Navigation user={user} onLogout={handleLogout} />

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-airbnb-dark">
            Discover Your Perfect Getaway
          </h1>
          <p className="text-lg md:text-xl text-airbnb-light mb-12 max-w-2xl mx-auto">
            Explore unique homes and experiences around the world
          </p>
          
          <PropertySearch onSearch={handleSearch} />
        </div>
      </section>

      <Categories 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <PropertiesGrid
        properties={properties}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        filters={filters}
      />
    </div>
  );
};

export default Index;
