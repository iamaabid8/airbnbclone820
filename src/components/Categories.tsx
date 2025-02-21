
import { ImageOff } from "lucide-react";

const fallbackImages = {
  "Beach Houses": "/beach-house-default.jpg",
  "Mountain Cabins": "/mountain-cabin-default.jpg",
  "Luxury Villas": "/luxury-villa-default.jpg",
  "City Apartments": "/city-apartment-default.jpg",
  default: "https://placehold.co/600x400/png?text=Property"
};

const categoryImages = {
  "Beach Houses": "https://placehold.co/600x400/png?text=Beach+Houses",
  "Mountain Cabins": "https://placehold.co/600x400/png?text=Mountain+Cabins",
  "Luxury Villas": "https://placehold.co/600x400/png?text=Luxury+Villas",
  "City Apartments": "https://placehold.co/600x400/png?text=City+Apartments"
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
