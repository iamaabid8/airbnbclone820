
import { Star, MapPin, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyHeaderProps {
  title: string;
  rating: number;
  totalRatings: number;
  location: string;
}

export const PropertyHeader = ({ title, rating, totalRatings, location }: PropertyHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-airbnb-dark mb-4">{title}</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="font-semibold">{rating}</span>
            <span className="text-airbnb-light ml-1">({totalRatings} reviews)</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-airbnb-primary mr-1" />
            <span>{location}</span>
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
  );
};
