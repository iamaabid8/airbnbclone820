
import { Search, MapPin, Calendar, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PropertySearch, type PropertyFilters } from "@/components/PropertySearch";
import { useQuery } from "@tanstack/react-query";

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*');

      if (filters) {
        // Apply filters
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

      const { data, error } = await query;
      if (error) throw error;
      return data as Property[];
    },
    enabled: true,
  });

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
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
  };

  return (
    <div className="min-h-screen w-full">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-airbnb-dark">
            Find your next stay
          </h1>
          <p className="text-lg md:text-xl text-airbnb-light mb-12 max-w-2xl mx-auto">
            Search low prices on hotels, homes, and much more...
          </p>
          
          <PropertySearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-airbnb-dark mb-12">
            {filters ? 'Search Results' : 'Featured places to stay'}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties?.map((property) => (
                <div key={property.id} className="property-card rounded-xl overflow-hidden bg-white">
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-airbnb-dark mb-2">
                          {property.title}
                        </h3>
                        <p className="text-airbnb-light">{property.location}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-airbnb-dark">{property.rating || "New"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-airbnb-dark">
                        <span className="font-semibold">${property.price_per_night}</span> / night
                      </p>
                      <Link to={`/property/${property.id}`}>
                        <Button variant="outline" className="hover:bg-airbnb-primary hover:text-white transition-colors">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-airbnb-dark mb-12">
            Browse by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Beach Houses', 'Mountain Cabins', 'Luxury Villas', 'City Apartments'].map((category) => (
              <div key={category} className="group cursor-pointer">
                <div className="aspect-square rounded-xl bg-gray-200 mb-4 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1721322800607-8c38375eef04`}
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-lg font-semibold text-airbnb-dark text-center">
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
