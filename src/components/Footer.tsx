
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 w-full">
      <div className="container mx-auto px-6 flex flex-col items-center">
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mb-6">
          <a 
            href="https://facebook.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <Facebook size={20} />
          </a>
          <a 
            href="https://instagram.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <Twitter size={20} />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
          >
            <Youtube size={20} />
          </a>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link to="/news" className="text-white hover:text-gray-300 transition-colors">
            News
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300 transition-colors">
            About
          </Link>
          <div className="flex flex-col items-center">
            <Link to="/contact" className="text-white hover:text-gray-300 transition-colors">
              Contact Us
            </Link>
            <a href="mailto:wanderhome@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors">
              wanderhome@gmail.com
            </a>
            <a href="tel:0221456777" className="text-sm text-gray-400 hover:text-white transition-colors">
              0221456777
            </a>
          </div>
          <Link to="/team" className="text-white hover:text-gray-300 transition-colors">
            Our Team
          </Link>
        </div>
        
        {/* Copyright */}
        <div className="text-sm text-gray-400 border-t border-gray-800 pt-4 w-full text-center">
          <p>Copyright ©{new Date().getFullYear()}, Designed by AABID</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
