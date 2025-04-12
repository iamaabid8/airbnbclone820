
import { ImageOff } from "lucide-react";

const fallbackImages = {
  "Beach Houses": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "Mountain Cabins": "https://images.unsplash.com/photo-1472396961693-142e6e269027",
  "Luxury Villas": "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
  "City Apartments": "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
  default: "https://images.unsplash.com/photo-1487958449943-2429e8be8625"
};

// Map display names to database values based on what's actually in the database
const categoryMap = {
  "Beach Houses": "villa", // Changed from "beach houses" to match actual data
  "Mountain Cabins": "cabin", // Changed from "mountain cabins" to match actual data
  "Luxury Villas": "villa", // Changed from "luxury villas" to match actual data
  "City Apartments": "apartment" // Changed from "city apartments" to match actual data
};

const categoryImages = {
  "Beach Houses": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "Mountain Cabins": "https://images.unsplash.com/photo-1472396961693-142e6e269027",
  "Luxury Villas": "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
  "City Apartments": "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
};

interface CategoriesProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

export const Categories = ({ selectedCategory, onCategorySelect }: CategoriesProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImages.default;
  };

  const handleCategoryClick = (displayName: string) => {
    // Pass the database value mapping when a category is selected
    onCategorySelect(categoryMap[displayName] || displayName);
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-airbnb-dark mb-8">
          Browse by property type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(categoryImages).map(([displayName, image]) => {
            // Check if the selected category matches this category's database value
            const isSelected = selectedCategory === categoryMap[displayName];
            
            return (
              <div
                key={displayName}
                className="group cursor-pointer"
                onClick={() => handleCategoryClick(displayName)}
              >
                <div className="aspect-square rounded-xl bg-gray-200 mb-4 overflow-hidden relative">
                  <img
                    src={image}
                    alt={displayName}
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className={`text-lg font-semibold text-center ${
                  isSelected ? 'text-airbnb-primary' : 'text-airbnb-dark'
                }`}>
                  {displayName}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
