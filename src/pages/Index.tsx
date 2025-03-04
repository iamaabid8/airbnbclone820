
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertySearch, type PropertyFilters } from "@/components/PropertySearch";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/Navigation";
import { Categories } from "@/components/Categories";
import { PropertiesGrid } from "@/components/PropertiesGrid";
import { Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";

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

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ['properties', filters, selectedCategory],
    queryFn: async () => {
      console.log("Fetching properties with filters:", filters);
      console.log("Selected category:", selectedCategory);
      
      let query = supabase
        .from('properties')
        .select('*')
        .gt('price_per_night', 0);

      if (filters) {
        if (filters.location && filters.location.trim() !== '') {
          query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.propertyType && filters.propertyType !== 'All types') {
          query = query.eq('property_type', filters.propertyType);
        }
        if (filters.priceRange && filters.priceRange.length === 2) {
          query = query
            .gte('price_per_night', filters.priceRange[0])
            .lte('price_per_night', filters.priceRange[1]);
        }
        if (filters.minRating > 0) {
          query = query.gte('rating', filters.minRating);
        }
        if (filters.amenities && filters.amenities.length > 0) {
          // For amenities which is an array, we need to check if any of the items exist in the array
          filters.amenities.forEach(amenity => {
            query = query.contains('amenities', [amenity]);
          });
        }
        if (filters.guests && filters.guests > 1) {
          query = query.gte('max_guests', filters.guests);
        }
      }

      if (selectedCategory) {
        // Category names don't match property_type directly, map them
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

  const handleSearch = (newFilters: PropertyFilters) => {
    console.log("Search triggered with filters:", newFilters);
    setFilters(newFilters);
    setSelectedCategory(null); // Reset category when searching
    
    // Add a toast notification to confirm search
    toast({
      title: "Search applied",
      description: `Searching for properties in ${newFilters.location}`,
    });
  };

  const handleCategorySelect = (category: string) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    setFilters(null); // Reset filters when selecting a category
    
    // Add a toast notification to confirm category selection
    toast({
      title: "Category selected",
      description: `Browsing ${category}`,
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
        filters={filters}
        isAdmin={isAdmin}
        onDelete={handleDeleteProperty}
      />

      <footer className="bg-gray-100 mt-auto">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Safety Information</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Cancellation Options</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">COVID-19 Response</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Airbnb.org</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Against Discrimination</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Invite Friends</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Gift Cards</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Hosting</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Host Your Home</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Host an Experience</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Responsible Hosting</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Resource Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Newsroom</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Investors</a></li>
                <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 md:mb-0">
                <a href="#" className="text-gray-600 hover:text-airbnb-primary">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-airbnb-primary">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-airbnb-primary">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-600 hover:text-airbnb-primary">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
              
              <div className="flex items-center text-gray-600">
                <span>Made with</span>
                <Heart className="h-4 w-4 mx-1 text-airbnb-primary" />
                <span>by Airbnb Clone</span>
              </div>
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-600">
              © {new Date().getFullYear()} Airbnb Clone. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
