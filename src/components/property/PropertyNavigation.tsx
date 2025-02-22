
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const PropertyNavigation = () => {
  return (
    <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
      <div className="container mx-auto flex items-center">
        <Link to="/" className="flex items-center text-airbnb-dark hover:text-airbnb-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Search
        </Link>
      </div>
    </nav>
  );
};
