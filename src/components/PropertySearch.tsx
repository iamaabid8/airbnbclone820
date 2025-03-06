
import { useState } from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
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
    priceRange: [0, 25000], // Updated to a more realistic range based on the data
    propertyType: "All types",
    amenities: [],
    minRating: 0,
  });
  const { toast } = useToast();

  // Handle search button click
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
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-full shadow-lg border p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 border rounded-full flex-1">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="border-0 p-0 focus-visible:ring-0 text-base placeholder:text-muted-foreground"
            />
          </div>

          <Dialog open={showFilters} onOpenChange={setShowFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Filters</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Price Range */}
                <div className="space-y-4">
                  <Label>Price range per night</Label>
                  <div className="flex items-center justify-between text-sm">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                  <Slider
                    value={filters.priceRange}
                    min={0}
                    max={25000}
                    step={1000}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                    className="mt-2"
                  />
                </div>

                {/* Property Type */}
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

                {/* Amenities */}
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

                {/* Minimum Rating */}
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
              <div className="flex justify-end mt-4">
                <Button onClick={() => {
                  onSearch(filters);
                  setShowFilters(false);
                }}>Apply Filters</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleSearch} size="lg" className="rounded-full gap-2 py-6">
            <Search className="h-5 w-5" />
            <span className="text-base">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
