
import { useState, useEffect } from "react";
import { Plus, Settings, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/PropertyCard";

const HostDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    location: "",
    price_per_night: "",
    property_type: "apartment",
    bedrooms: "1",
    bathrooms: "1",
    max_guests: "2",
    amenities: [] as string[],
  });
  const [images, setImages] = useState<FileList | null>(null);

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
    if (propertyIds.length === 0) {
      setBookings([]);
      return;
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        user:user_id (
          email
        )
      `)
      .in('property_id', propertyIds);

    // Just set empty bookings array if there's an error, don't show any toast
    if (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      return;
    }

    setBookings(data || []);
  };

  const handleImageUpload = async (files: FileList) => {
    const uploadedUrls = [];
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) {
        toast({
          title: "Error",
          description: `Failed to upload image ${file.name}`,
          variant: "destructive",
        });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    setIsUploading(false);
    return uploadedUrls;
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrls: string[] = [];
      
      if (images && images.length > 0) {
        imageUrls = await handleImageUpload(images);
      }

      const { error } = await supabase
        .from('properties')
        .insert([
          {
            ...newProperty,
            owner_id: user.id,
            price_per_night: parseFloat(newProperty.price_per_night),
            bedrooms: parseInt(newProperty.bedrooms),
            bathrooms: parseInt(newProperty.bathrooms),
            max_guests: parseInt(newProperty.max_guests),
            images: imageUrls,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property listed successfully",
      });

      setIsAddPropertyOpen(false);
      setNewProperty({
        title: "",
        description: "",
        location: "",
        price_per_night: "",
        property_type: "apartment",
        bedrooms: "1",
        bathrooms: "1",
        max_guests: "2",
        amenities: [],
      });
      setImages(null);
      fetchProperties(user.id);
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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-airbnb-primary">Homi Host Dashboard</span>
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
                  onClick={() => setIsAddPropertyOpen(true)}
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
                <PropertyCard key={property.id} property={property} />
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
                            {booking.user?.email || "Guest"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{booking.total_price.toLocaleString('en-IN')}</p>
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

      <Dialog open={isAddPropertyOpen} onOpenChange={setIsAddPropertyOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProperty} className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title</Label>
              <Input
                id="title"
                value={newProperty.title}
                onChange={(e) => setNewProperty({...newProperty, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newProperty.description}
                onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newProperty.location}
                onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price per Night (₹)</Label>
              <Input
                id="price"
                type="number"
                value={newProperty.price_per_night}
                onChange={(e) => setNewProperty({...newProperty, price_per_night: e.target.value})}
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="property_type">Property Type</Label>
              <Input
                id="property_type"
                value={newProperty.property_type}
                onChange={(e) => setNewProperty({...newProperty, property_type: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={newProperty.bedrooms}
                  onChange={(e) => setNewProperty({...newProperty, bedrooms: e.target.value})}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={newProperty.bathrooms}
                  onChange={(e) => setNewProperty({...newProperty, bathrooms: e.target.value})}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="max_guests">Max Guests</Label>
                <Input
                  id="max_guests"
                  type="number"
                  value={newProperty.max_guests}
                  onChange={(e) => setNewProperty({...newProperty, max_guests: e.target.value})}
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="images">Property Images</Label>
              <Input
                id="images"
                type="file"
                onChange={(e) => setImages(e.target.files)}
                accept="image/*"
                multiple
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddPropertyOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Add Property"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostDashboard;
