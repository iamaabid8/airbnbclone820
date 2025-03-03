
import { User, Settings, BookOpen, Home, Heart, LogOut, Plus, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    avatar_url: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
    });
  }, [navigate]);

  useEffect(() => {
    if (user) {
      if (profile?.role === 'host') {
        fetchProperties();
      }
      fetchBookings();
    }
  }, [user, profile]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
  };

  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', user.id);

    if (error) {
      console.error('Error fetching properties:', error);
      return;
    }

    setProperties(data || []);
  };

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        property:properties(*)
      `)
      .eq('user_id', user.id)
      .neq('status', 'cancelled'); // Only fetch non-cancelled bookings

    if (error) {
      console.error('Error fetching bookings:', error);
      return;
    }

    setBookings(data || []);
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          avatar_url: editForm.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      fetchProfile(user.id);
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully.",
      });

      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-airbnb-primary font-heading text-2xl font-bold">
            airbnb
          </Link>
        </div>
      </nav>

      <div className="container mx-auto pt-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-airbnb-dark mb-2">
                  {profile?.name || user?.email}
                </h1>
                <p className="text-airbnb-light">
                  {profile?.role === 'host' ? 'Host' : 'Guest'} • Member since{' '}
                  {new Date(user?.created_at || Date.now()).getFullYear()}
                </p>
              </div>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <Settings className="w-5 h-5 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={editForm.avatar_url}
                        onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProfile}>
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ul className="space-y-4">
                  {profile?.role === 'host' ? (
                    <>
                      <li>
                        <Button variant="ghost" className="w-full justify-start text-airbnb-dark hover:text-airbnb-primary">
                          <Home className="w-5 h-5 mr-3" />
                          My Properties
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" className="w-full justify-start text-airbnb-dark hover:text-airbnb-primary">
                          <Calendar className="w-5 h-5 mr-3" />
                          Reservations
                        </Button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Button variant="ghost" className="w-full justify-start text-airbnb-dark hover:text-airbnb-primary">
                          <BookOpen className="w-5 h-5 mr-3" />
                          My Bookings
                        </Button>
                      </li>
                      <li>
                        <Button variant="ghost" className="w-full justify-start text-airbnb-dark hover:text-airbnb-primary">
                          <Heart className="w-5 h-5 mr-3" />
                          Saved
                        </Button>
                      </li>
                    </>
                  )}
                  <li>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign Out
                    </Button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-3">
              {profile?.role === 'host' ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-airbnb-dark">
                      My Properties
                    </h2>
                    <Button>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Property
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {properties.map((property) => (
                      <div key={property.id} className="flex flex-col md:flex-row border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="w-full md:w-48 aspect-video md:aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                          <img
                            src={property.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994"}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-airbnb-dark mb-2">
                            {property.title}
                          </h3>
                          <p className="text-airbnb-light mb-4 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {property.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-airbnb-dark font-semibold">
                              ${property.price_per_night} per night
                            </span>
                            <Button variant="outline">Edit Property</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-airbnb-dark mb-6">
                    My Bookings
                  </h2>
                  
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col md:flex-row border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="w-full md:w-48 aspect-video md:aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                          <img
                            src={booking.property?.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994"}
                            alt={booking.property?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-airbnb-dark mb-2">
                            {booking.property?.title}
                          </h3>
                          <p className="text-airbnb-light mb-4">
                            Check-in: {new Date(booking.check_in).toLocaleDateString()}
                            <br />
                            Check-out: {new Date(booking.check_out).toLocaleDateString()}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-airbnb-dark font-semibold">
                              ${booking.total_price} total
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-sm ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-600'
                                  : booking.status === 'cancelled'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-yellow-100 text-yellow-600'
                              }`}>
                                {booking.status}
                              </span>
                              {booking.status !== 'cancelled' && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                      Cancel
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel this booking? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleCancelBooking(booking.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Cancel Booking
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                              <Button variant="outline">View Details</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
