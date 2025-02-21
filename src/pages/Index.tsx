import { User, LogOut, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertySearch, type PropertyFilters } from "@/components/PropertySearch";
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/PropertyCard";

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

const fallbackImages = {
  "Beach Houses": "/beach-house-default.jpg",
  "Mountain Cabins": "/mountain-cabin-default.jpg",
  "Luxury Villas": "/luxury-villa-default.jpg",
  "City Apartments": "/city-apartment-default.jpg",
  default: "https://placehold.co/600x400/png?text=Property"
};

const categoryImages = {
  "Beach Houses": "https://placehold.co/600x400/png?text=Beach+Houses",
  "Mountain Cabins": "https://placehold.co/600x400/png?text=Mountain+Cabins",
  "Luxury Villas": "https://placehold.co/600x400/png?text=Luxury+Villas",
  "City Apartments": "https://placehold.co/600x400/png?text=City+Apartments"
};

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState<PropertyFilters | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['properties', filters, selectedCategory],
    queryFn: async () => {
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
      if (error) throw error;
      return data as Property[];
    },
    enabled: true,
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImages.default;
  };

  return (
    <div className="min-h-screen w-full">
      <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-airbnb-primary font-heading text-2xl font-bold">
            airbnb
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/admin" className="nav-link">Become a Host</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="ghost" className="nav-link">
                    <User className="w-5 h-5 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" className="nav-link" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="nav-link">
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

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

      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-airbnb-dark mb-8">
            Browse by property type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(categoryImages).map(([category, image]) => (
              <div
                key={category}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category);
                  setFilters(null);
                }}
              >
                <div className="aspect-square rounded-xl bg-gray-200 mb-4 overflow-hidden relative">
                  <img
                    src={image}
                    alt={category}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className={`text-lg font-semibold text-center ${
                  selectedCategory === category ? 'text-airbnb-primary' : 'text-airbnb-dark'
                }`}>
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <footer className="bg-gray-100 py-20 px-6">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Help Center</a></li>
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Safety Information</a></li>
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Cancellation Options</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Community</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Blog</a></li>
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Forum</a></li>
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Hosting</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Try Hosting</a></li>
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Resources</a></li>
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Community Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">About Us</a></li>
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Careers</a></li>
              <li><a href="#" className="text-airbnb-light hover:text-airbnb-primary">Press</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
