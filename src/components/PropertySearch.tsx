
import { useState, useCallback } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export type PropertyFilters = {
  location: string;
};

interface PropertySearchProps {
  onSearch: (filters: PropertyFilters) => void;
}

export const PropertySearch = ({ onSearch }: PropertySearchProps) => {
  const [location, setLocation] = useState("");
  const { toast } = useToast();

  // Optimized search handler with debounce
  const handleSearch = useCallback(() => {
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Submitting search with location:", location);
    onSearch({ location });
  }, [location, onSearch, toast]);

  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-full shadow-lg border">
      <div className="flex flex-col md:flex-row p-2 md:p-4 items-center">
        <div className="flex-1 px-4">
          <div className="font-medium text-sm mb-1">Where</div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search destinations"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 p-0 focus-visible:ring-0 text-base placeholder:text-gray-400"
            />
          </div>
        </div>

        <Button 
          onClick={handleSearch} 
          className="rounded-full bg-airbnb-primary hover:bg-airbnb-primary/90 text-white min-w-28"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};
