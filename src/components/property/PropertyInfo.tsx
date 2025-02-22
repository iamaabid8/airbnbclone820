
interface PropertyInfoProps {
  description: string | null;
  amenities: string[] | null;
}

export const PropertyInfo = ({ description, amenities }: PropertyInfoProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-airbnb-dark mb-6">
        About this place
      </h2>
      <p className="text-airbnb-light mb-8">{description}</p>
      
      <h3 className="text-xl font-bold text-airbnb-dark mb-4">
        What this place offers
      </h3>
      <ul className="grid grid-cols-2 gap-4 mb-8">
        {amenities?.map((amenity) => (
          <li key={amenity} className="flex items-center text-airbnb-light">
            <span className="w-2 h-2 bg-airbnb-primary rounded-full mr-2" />
            {amenity}
          </li>
        ))}
      </ul>
    </div>
  );
};
