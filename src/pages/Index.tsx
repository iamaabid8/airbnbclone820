
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertySearch, type PropertyFilters } from "@/components/PropertySearch";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Categories } from "@/components/Categories";
import { PropertiesGrid } from "@/components/PropertiesGrid";
import { Footer } from "@/components/Footer";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Memoize the query function to prevent unnecessary rebuilds
  const getPropertiesQuery = useCallback(async () => {
    let query = supabase
      .from('properties')
      .select('*');

    if (filters) {
      if (filters.location && filters.location.trim() !== '') {
        query = query.ilike('location', `%${filters.location}%`);
      }
      
      if (filters.propertyType && filters.propertyType !== 'All types') {
        query = query.eq('property_type', filters.propertyType.toLowerCase());
      }
      
      if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 25000)) {
        query = query
          .gte('price_per_night', filters.priceRange[0])
          .lte('price_per_night', filters.priceRange[1]);
      }
      
      if (filters.minRating && filters.minRating > 0) {
        query = query.gte('rating', filters.minRating);
      }
      
      if (filters.amenities && filters.amenities.length > 0) {
        query = query.contains('amenities', filters.amenities);
      }
    }

    if (selectedCategory && selectedCategory !== 'All') {
      query = query.eq('property_type', selectedCategory);
    }

    // Limit the columns returned when not needed for better performance
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
    
    return data as Property[];
  }, [filters, selectedCategory]);

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['properties', filters, selectedCategory],
    queryFn: getPropertiesQuery,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes cache before refetching
  });

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

  const handleSearch = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setSelectedCategory(null);
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setFilters(null);
  }, []);

  const handleDeleteProperty = () => {
    refetch();
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
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
        isAdmin={isAdmin}
        onDelete={handleDeleteProperty}
      />

      <Footer />
    </div>
  );
};

export default Index;
