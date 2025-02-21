
import { ImageOff } from "lucide-react";

const fallbackImages = {
  "Beach Houses": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "Mountain Cabins": "https://images.unsplash.com/photo-1472396961693-142e6e269027",
  "Luxury Villas": "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
  "City Apartments": "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
  default: "https://images.unsplash.com/photo-1487958449943-2429e8be8625"
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

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-airbnb-dark mb-8">
          Browse by property type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(categoryImages).map(([category, image]) => (
            <div
              key={category}
              className="group cursor-pointer"
              onClick={() => onCategorySelect(category)}
            >
              <div className="aspect-square rounded-xl bg-gray-200 mb-4 overflow-hidden relative">
                <img
                  src={image}
                  alt={category}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className={`text-lg font-semibold text-center ${
                selectedCategory === category ? 'text-airbnb-primary' : 'text-airbnb-dark'
              }`}>
                {category}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
