
import { Facebook, Twitter, Instagram, Youtube, Heart, Mail, Phone, Info } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-600 hover:text-airbnb-primary">Help Center</a></li>
              <li><a href="/safety" className="text-gray-600 hover:text-airbnb-primary">Safety Information</a></li>
              <li><a href="/cancellation" className="text-gray-600 hover:text-airbnb-primary">Cancellation Options</a></li>
              <li><a href="/covid" className="text-gray-600 hover:text-airbnb-primary">COVID-19 Response</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="/charity" className="text-gray-600 hover:text-airbnb-primary">Airbnb.org</a></li>
              <li><a href="/policies" className="text-gray-600 hover:text-airbnb-primary">Against Discrimination</a></li>
              <li><a href="/invite" className="text-gray-600 hover:text-airbnb-primary">Invite Friends</a></li>
              <li><a href="/gift" className="text-gray-600 hover:text-airbnb-primary">Gift Cards</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li><a href="/host-home" className="text-gray-600 hover:text-airbnb-primary">Host Your Home</a></li>
              <li><a href="/host-experience" className="text-gray-600 hover:text-airbnb-primary">Host an Experience</a></li>
              <li><a href="/responsible-hosting" className="text-gray-600 hover:text-airbnb-primary">Responsible Hosting</a></li>
              <li><a href="/resources" className="text-gray-600 hover:text-airbnb-primary">Resource Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-airbnb-primary" />
                <a href="mailto:wanderhome@gmail.com" className="text-gray-600 hover:text-airbnb-primary">wanderhome@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-airbnb-primary" />
                <a href="tel:0221456777" className="text-gray-600 hover:text-airbnb-primary">0221456777</a>
              </li>
              <li className="flex items-center">
                <Info className="h-4 w-4 mr-2 text-airbnb-primary" />
                <Link to="/about" className="text-gray-600 hover:text-airbnb-primary">About</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-airbnb-primary">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-airbnb-primary">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-airbnb-primary">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-airbnb-primary">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            
            <div className="flex items-center text-gray-600">
              <span>Designed by</span>
              <Heart className="h-4 w-4 mx-1 text-airbnb-primary" />
              <span>AABID</span>
            </div>
          </div>
          
          <div className="text-center mt-4 text-sm text-gray-600">
            © {new Date().getFullYear()} Airbnb Clone. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
