
import { MapPin, Calendar, User, Star, Share2, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PropertyDetails = () => {
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
            Luxury Villa with Ocean View
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">4.9</span>
                <span className="text-airbnb-light ml-1">(128 reviews)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-airbnb-primary mr-1" />
                <span>New York, USA</span>
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
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
              alt="Property Main"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${1649972904349 + index}`}
                  alt={`Property ${index + 1}`}
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
              Experience luxury living in this stunning villa with breathtaking ocean views. This spacious property features modern amenities, a private pool, and direct beach access. Perfect for families or groups looking for an unforgettable stay.
            </p>
            
            <h3 className="text-xl font-bold text-airbnb-dark mb-4">
              What this place offers
            </h3>
            <ul className="grid grid-cols-2 gap-4 mb-8">
              {["Pool", "Ocean View", "WiFi", "Kitchen", "Parking", "Air Conditioning"].map((amenity) => (
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
                <span className="text-2xl font-bold text-airbnb-dark">$299</span>
                <span className="text-airbnb-light">per night</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center border rounded-lg p-3">
                  <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
                  <input
                    type="text"
                    placeholder="Check-in - Check-out"
                    className="w-full border-none focus:outline-none"
                  />
                </div>
                <div className="flex items-center border rounded-lg p-3">
                  <User className="w-5 h-5 text-airbnb-primary mr-2" />
                  <input
                    type="number"
                    placeholder="Guests"
                    className="w-full border-none focus:outline-none"
                  />
                </div>
              </div>

              <Button className="w-full bg-airbnb-primary hover:bg-airbnb-primary/90 text-white">
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
