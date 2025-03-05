
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 w-full">
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mb-6">
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <Facebook size={20} />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <Youtube size={20} />
          </a>
        </div>
        
        {/* Navigation Links */}
        <div className="flex justify-center space-x-8 mb-6">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link to="/news" className="text-white hover:text-gray-300 transition-colors">
            News
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-300 transition-colors">
            Contact Us
          </Link>
          <Link to="/team" className="text-white hover:text-gray-300 transition-colors">
            Our Team
          </Link>
        </div>
        
        {/* Copyright */}
        <div className="text-sm text-gray-400 border-t border-gray-800 pt-4 w-full text-center">
          <p>Copyright ©{new Date().getFullYear()}, Designed by FAHEEM</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
