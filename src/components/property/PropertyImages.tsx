
interface PropertyImagesProps {
  images: string[] | null;
  title: string;
}

export const PropertyImages = ({ images, title }: PropertyImagesProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-12">
      <div className="col-span-2 md:col-span-1 aspect-video bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={images?.[0] || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="hidden md:grid grid-cols-2 gap-4">
        {(images?.slice(1, 5) || Array(4).fill(null)).map((image, index) => (
          <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={image || `https://images.unsplash.com/photo-${1649972904349 + index}`}
              alt={`${title} ${index + 2}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
