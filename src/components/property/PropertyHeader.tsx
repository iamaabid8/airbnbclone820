
import { Share, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyHeaderProps {
  title: string;
  location: string;
  shortDescription?: string;
}

export const PropertyHeader = ({
  title,
  location,
  shortDescription
}: PropertyHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      {shortDescription && (
        <p className="text-gray-600 mb-2 italic">{shortDescription}</p>
      )}
      <div className="flex items-center justify-between">
        <p className="text-lg text-gray-600">{location}</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Heart className="h-4 w-4" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
};
