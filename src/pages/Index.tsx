import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertySearch, type PropertyFilters } from "@/components/PropertySearch";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Categories } from "@/components/Categories";
import { PropertiesGrid } from "@/components/PropertiesGrid";
import Footer from "@/components/Footer";

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
  const [searchLocation, setSearchLocation] = useState<string | null>(null);
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

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['properties', searchLocation, selectedCategory],
    queryFn: async () => {
      console.log("Fetching properties with location:", searchLocation);
      console.log("Selected category:", selectedCategory);
      
      let query = supabase
        .from('properties')
        .select('*')
        .gt('price_per_night', 0);

      if (searchLocation && searchLocation.trim() !== '') {
        query = query.ilike('location', `%${searchLocation.trim()}%`);
      }

      if (selectedCategory) {
        const categoryToPropertyType: Record<string, string> = {
          "Beach Houses": "villa",
          "Mountain Cabins": "cabin",
          "Luxury Villas": "villa",
          "City Apartments": "apartment"
        };
        
        const propertyType = categoryToPropertyType[selectedCategory];
        if (propertyType) {
          query = query.eq('property_type', propertyType);
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching properties:", error);
        throw error;
      }
      
      console.log("Properties fetched:", data?.length);
      return data as Property[];
    },
    enabled: true,
    refetchOnWindowFocus: false,
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

  const handleSearch = (filters: PropertyFilters) => {
    console.log("Search triggered with location:", filters.location);
    setSearchLocation(filters.location);
    setSelectedCategory(null);
    
    toast({
      title: "Search applied",
      description: `Searching for properties in ${filters.location}`,
    });
  };

  const handleCategorySelect = (category: string) => {
    console.log("Category selected:", category);
    setSelectedCategory(category || null);
    setSearchLocation(null);
    
    toast({
      title: category ? "Category selected" : "Categories cleared",
      description: category ? `Browsing ${category}` : "Showing all properties",
    });
  };

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
        filters={searchLocation ? { location: searchLocation } : null}
        isAdmin={isAdmin}
        onDelete={handleDeleteProperty}
      />

      <Footer />
    </div>
  );
};

export default Index;
