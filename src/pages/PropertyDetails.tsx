
import { MapPin, Calendar, User, Star, Share2, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const [guests, setGuests] = useState(1);
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const { toast } = useToast();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleBooking = () => {
    if (!dates.checkIn || !dates.checkOut) {
      toast({
        title: "Select dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking initiated",
      description: "We'll redirect you to complete your booking",
    });
    // Add booking logic here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="container mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-80 bg-gray-200 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-24 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold text-airbnb-dark">Property not found</h1>
          <Link to="/" className="text-airbnb-primary hover:underline mt-4 inline-block">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const priceInRupees = Math.round(property.price_per_night * 83);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="flex items-center text-airbnb-dark hover:text-airbnb-primary">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </Link>
        </div>
      </nav>

      <div className="container mx-auto pt-24 px-6">
        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-airbnb-dark mb-4">
            {property.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{property.rating}</span>
                <span className="text-airbnb-light ml-1">({property.total_ratings} reviews)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-airbnb-primary mr-1" />
                <span>{property.location}</span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="col-span-2 md:col-span-1 aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={property.images?.[0] || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {(property.images?.slice(1, 5) || Array(4).fill(null)).map((image, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={image || `https://images.unsplash.com/photo-${1649972904349 + index}`}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-airbnb-dark mb-6">
              About this place
            </h2>
            <p className="text-airbnb-light mb-8">
              {property.description}
            </p>
            
            <h3 className="text-xl font-bold text-airbnb-dark mb-4">
              What this place offers
            </h3>
            <ul className="grid grid-cols-2 gap-4 mb-8">
              {property.amenities?.map((amenity) => (
                <li key={amenity} className="flex items-center text-airbnb-light">
                  <span className="w-2 h-2 bg-airbnb-primary rounded-full mr-2" />
                  {amenity}
                </li>
              ))}
            </ul>
          </div>

          {/* Booking Card */}
          <div className="md:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-airbnb-dark">₹{priceInRupees.toLocaleString('en-IN')}</span>
                <span className="text-airbnb-light">per night</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center border rounded-lg p-3">
                  <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
                  <Input
                    type="date"
                    placeholder="Check-in"
                    value={dates.checkIn}
                    onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                    className="border-none focus:outline-none"
                  />
                </div>
                <div className="flex items-center border rounded-lg p-3">
                  <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
                  <Input
                    type="date"
                    placeholder="Check-out"
                    value={dates.checkOut}
                    onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                    className="border-none focus:outline-none"
                  />
                </div>
                <div className="flex items-center border rounded-lg p-3">
                  <User className="w-5 h-5 text-airbnb-primary mr-2" />
                  <Input
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="border-none focus:outline-none"
                    placeholder="Guests"
                  />
                </div>
              </div>

              <Button 
                className="w-full bg-airbnb-primary hover:bg-airbnb-primary/90 text-white"
                onClick={handleBooking}
              >
                Reserve Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
