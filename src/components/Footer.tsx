
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white py-8 border-t">
      <div className="container mx-auto px-4">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Youtube className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center space-x-6 mb-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
            Services
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link to="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
            Privacy Policy
          </Link>
        </nav>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Homi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
