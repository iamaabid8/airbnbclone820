
import { PropertySearch, type PropertyFilters } from "@/components/PropertySearch";

interface HeroProps {
  onSearch: (filters: PropertyFilters) => void;
}

export const Hero = ({ onSearch }: HeroProps) => {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-airbnb-dark">
          Discover Your Perfect Getaway
        </h1>
        <p className="text-lg md:text-xl text-airbnb-light mb-12 max-w-2xl mx-auto">
          Explore unique homes and experiences around the world
        </p>
        
        <PropertySearch onSearch={onSearch} />
      </div>
    </section>
  );
};
