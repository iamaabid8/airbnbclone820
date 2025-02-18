import { useState, useEffect } from "react";
import { Users, Home, BookOpen, BarChart, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeUsers: 0,
    totalBookings: 0,
    revenue: 0,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel",
          variant: "destructive",
        });
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "properties" || activeTab === "dashboard") {
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('*');
          
          if (propertiesError) throw propertiesError;
          setProperties(propertiesData || []);
        }

        if (activeTab === "users" || activeTab === "dashboard") {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*');
          
          if (profilesError) throw profilesError;
          setUsers(profilesData || []);
        }

        if (activeTab === "bookings" || activeTab === "dashboard") {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select(`
              *,
              property:properties(*)
            `);
          
          if (bookingsError) throw bookingsError;
          setBookings(bookingsData || []);
        }

        if (activeTab === "dashboard") {
          setStats({
            totalProperties: properties.length,
            activeUsers: users.length,
            totalBookings: bookings.length,
            revenue: bookings.reduce((acc: number, booking: any) => 
              acc + Number(booking.total_price), 0),
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to fetch data: " + error.message,
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [activeTab]);

  const handleDeleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProperties(properties.filter((prop: any) => prop.id !== id));
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete property: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleSuspendUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'suspended' })
        .eq('id', id);
      
      if (error) throw error;
      
      setUsers(users.map((user: any) => 
        user.id === id ? { ...user, status: 'suspended' } : user
      ));
      toast({
        title: "Success",
        description: "User suspended successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to suspend user: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-airbnb-primary font-heading text-2xl font-bold">
            airbnb admin
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
            <Button 
              variant="ghost" 
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/auth');
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen pt-20">
        <div className="w-64 bg-white shadow-sm fixed h-full">
          <div className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "dashboard"
                    ? "bg-airbnb-primary text-white"
                    : "text-airbnb-dark hover:bg-gray-100"
                }`}
              >
                <BarChart className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("properties")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "properties"
                    ? "bg-airbnb-primary text-white"
                    : "text-airbnb-dark hover:bg-gray-100"
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Properties
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "users"
                    ? "bg-airbnb-primary text-white"
                    : "text-airbnb-dark hover:bg-gray-100"
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "bookings"
                    ? "bg-airbnb-primary text-white"
                    : "text-airbnb-dark hover:bg-gray-100"
                }`}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Bookings
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 ml-64 p-8">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold text-airbnb-dark mb-8">Dashboard Overview</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { title: "Total Properties", value: stats.totalProperties, icon: Home },
                  { title: "Active Users", value: stats.activeUsers, icon: Users },
                  { title: "Total Bookings", value: stats.totalBookings, icon: BookOpen },
                  { title: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: BarChart },
                ].map((stat) => (
                  <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="w-8 h-8 text-airbnb-primary" />
                      <span className="text-2xl font-bold text-airbnb-dark">{stat.value}</span>
                    </div>
                    <h3 className="text-airbnb-light">{stat.title}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-airbnb-dark mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          <Users className="w-5 h-5 text-airbnb-primary" />
                        </div>
                        <div>
                          <p className="text-airbnb-dark font-medium">New booking received</p>
                          <p className="text-airbnb-light text-sm">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "properties" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-airbnb-dark">Properties</h1>
                <Button className="bg-airbnb-primary hover:bg-airbnb-primary/90">
                  Add New Property
                </Button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="w-5 h-5 text-airbnb-light absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search properties..."
                      className="pl-10"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Filter</Button>
                    <Button variant="outline">Sort</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {properties.map((property: any) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
                          <img
                            src={property.images[0] || "https://via.placeholder.com/150"}
                            alt={property.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-airbnb-dark">{property.title}</h3>
                          <p className="text-airbnb-light">{property.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h1 className="text-2xl font-bold text-airbnb-dark mb-8">User Management</h1>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="w-5 h-5 text-airbnb-light absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                          <img
                            src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`}
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-airbnb-dark">{user.name}</h3>
                          <p className="text-airbnb-light">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleSuspendUser(user.id)}
                          disabled={user.status === 'suspended'}
                        >
                          {user.status === 'suspended' ? 'Suspended' : 'Suspend'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h1 className="text-2xl font-bold text-airbnb-dark mb-8">Booking Management</h1>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="w-5 h-5 text-airbnb-light absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search bookings..."
                      className="pl-10"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Filter by Status</Button>
                    <Button variant="outline">Sort by Date</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {bookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
                          <img
                            src={booking.property?.images?.[0] || "https://via.placeholder.com/150"}
                            alt={`Booking ${booking.id.slice(-6)}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-airbnb-dark">Booking #{booking.id.slice(-6)}</h3>
                          <p className="text-airbnb-light">
                            Check-in: {new Date(booking.check_in).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {booking.status}
                        </span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
