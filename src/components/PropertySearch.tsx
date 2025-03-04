
import { useState } from "react";
import { Search, MapPin, Calendar, User, SlidersHorizontal } from "lucide-react";
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
  "All types",
  "House",
  "Apartment",
  "Villa",
  "Cabin"
];

export const PropertySearch = ({ onSearch }: PropertySearchProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [0, 1000],
    propertyType: "All types",
    amenities: [],
    minRating: 0,
  });
  const { toast } = useToast();

  const handleSearch = () => {
    if (!filters.location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location to search",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Submitting search with filters:", filters);
    onSearch(filters);
    setShowFilters(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-background rounded-full shadow-lg border">
      <div className="flex flex-col md:flex-row md:items-center md:divide-x">
        {/* Location */}
        <div className="flex-1 p-4 hover:bg-accent rounded-l-full cursor-pointer transition-colors">
          <Label className="block text-xs font-medium mb-1">Where</Label>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="border-0 p-0 focus-visible:ring-0 text-sm placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex-1 p-4 hover:bg-accent cursor-pointer transition-colors">
          <Label className="block text-xs font-medium mb-1">Check in</Label>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={filters.checkIn}
              onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
              className="border-0 p-0 focus-visible:ring-0 text-sm"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex-1 p-4 hover:bg-accent cursor-pointer transition-colors">
          <Label className="block text-xs font-medium mb-1">Check out</Label>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={filters.checkOut}
              onChange={(e) => setFilters({ ...filters, checkOut: e.target.value })}
              className="border-0 p-0 focus-visible:ring-0 text-sm"
            />
          </div>
        </div>

        {/* Guests & Search */}
        <div className="flex items-center p-4 gap-4">
          <div className="hover:bg-accent rounded-full cursor-pointer transition-colors px-4">
            <Label className="block text-xs font-medium mb-1">Who</Label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="1"
                value={filters.guests}
                onChange={(e) => setFilters({ ...filters, guests: parseInt(e.target.value) })}
                className="border-0 p-0 focus-visible:ring-0 text-sm w-16"
                placeholder="Guests"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={showFilters} onOpenChange={setShowFilters}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-4">
                    <Label>Price range per night</Label>
                    <div className="flex items-center justify-between text-sm">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                    <Slider
                      value={filters.priceRange}
                      min={0}
                      max={1000}
                      step={50}
                      onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Property type</Label>
                    <RadioGroup
                      value={filters.propertyType}
                      onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
                      className="grid grid-cols-2 gap-2"
                    >
                      {propertyTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={type} />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
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

                  <div className="space-y-4">
                    <Label>Minimum rating</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[filters.minRating]}
                        min={0}
                        max={5}
                        step={0.5}
                        onValueChange={(value) => setFilters({ ...filters, minRating: value[0] })}
                      />
                      <div className="text-center text-sm">
                        {filters.minRating} stars and up
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSearch} className="rounded-full">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
