
import { useState, useEffect } from "react";
import { Plus, Settings, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HostDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchProperties(session.user.id);
    };

    checkUser();
  }, [navigate]);

  const fetchProperties = async (userId: string) => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      });
      return;
    }

    setProperties(data || []);
    fetchBookings(data.map((p: any) => p.id));
  };

  const fetchBookings = async (propertyIds: string[]) => {
    if (propertyIds.length === 0) return;

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles:profiles(name, email)
      `)
      .in('property_id', propertyIds);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
      return;
    }

    setBookings(data || []);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-airbnb-primary">Host Dashboard</span>
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{properties.length}</div>
                <p className="text-sm text-gray-500">Total properties listed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bookings.length}</div>
                <p className="text-sm text-gray-500">Total bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full"
                  onClick={() => navigate('/admin')}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Property
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Your Properties</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="pt-4">
                    <div className="aspect-video relative mb-4">
                      <img
                        src={property.images?.[0] || '/placeholder.svg'}
                        alt={property.title}
                        className="absolute inset-0 w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-gray-500">{property.location}</p>
                    <p className="text-lg font-semibold mt-2">₹{property.price_per_night}/night</p>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/property/${property.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
            <div className="bg-white rounded-lg shadow">
              {bookings.length > 0 ? (
                <div className="divide-y">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {booking.profiles?.name || booking.profiles?.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{booking.total_price}</p>
                          <p className="text-sm text-gray-500">{booking.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No bookings yet
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostDashboard;
