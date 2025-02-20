
import { useState } from "react";
import { Search, MapPin, Calendar, User, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

export type PropertyFilters = {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  priceRange: [number, number];
  propertyType: string;
  amenities: string[];
  minRating: number;
};

interface PropertySearchProps {
  onSearch: (filters: PropertyFilters) => void;
}

const amenitiesList = [
  "WiFi",
  "Kitchen",
  "Pool",
  "Parking",
  "Air Conditioning",
  "Washer",
  "Dryer",
  "TV",
  "Gym",
];

const propertyTypes = [
  "apartment",
  "house",
  "villa",
  "condo",
  "cabin",
];

export const PropertySearch = ({ onSearch }: PropertySearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [0, 1000],
    propertyType: "apartment",
    amenities: [],
    minRating: 0,
  });
  const { toast } = useToast();

  const handleSearch = () => {
    if (!filters.location) {
      toast({
        title: "Location required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }
    onSearch(filters);
    setShowFilters(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="search-bar rounded-full p-2 flex flex-col md:flex-row items-center gap-4 bg-white shadow-lg">
        <div className="flex-1 flex items-center px-4">
          <MapPin className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input 
            type="text" 
            placeholder="Where are you going?"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="border-none focus-visible:ring-0"
          />
        </div>
        <div className="w-px h-8 bg-gray-200 hidden md:block" />
        <div className="flex-1 flex items-center px-4">
          <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input 
            type="date" 
            value={filters.checkIn}
            onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
            className="border-none focus-visible:ring-0"
          />
        </div>
        <div className="w-px h-8 bg-gray-200 hidden md:block" />
        <div className="flex-1 flex items-center px-4">
          <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input 
            type="date"
            value={filters.checkOut}
            onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
            className="border-none focus-visible:ring-0"
          />
        </div>
        <div className="w-px h-8 bg-gray-200 hidden md:block" />
        <div className="flex-1 flex items-center px-4">
          <User className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input 
            type="number"
            min="1"
            value={filters.guests}
            onChange={(e) => setFilters({ ...filters, guests: parseInt(e.target.value) })}
            className="border-none focus-visible:ring-0"
            placeholder="Guests"
          />
        </div>
        
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="p-2">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Price Range (per night)</Label>
                <div className="flex items-center justify-between">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
                <Slider
                  value={filters.priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                />
              </div>

              <div className="space-y-2">
                <Label>Property Type</Label>
                <RadioGroup
                  value={filters.propertyType}
                  onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                  className="grid grid-cols-2 gap-2"
                >
                  {propertyTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="capitalize">{type}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={filters.amenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          setFilters({
                            ...filters,
                            amenities: checked
                              ? [...filters.amenities, amenity]
                              : filters.amenities.filter((a) => a !== amenity),
                          });
                        }}
                      />
                      <Label htmlFor={amenity}>{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <Slider
                  value={[filters.minRating]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => setFilters({ ...filters, minRating: value[0] })}
                />
                <div className="text-center">
                  {filters.minRating} stars and up
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={handleSearch} className="bg-airbnb-primary hover:bg-airbnb-primary/90 text-white rounded-full px-8">
          <Search className="w-5 h-5 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};
