
import { Facebook, Twitter, Instagram, Youtube, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Safety Information</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Cancellation Options</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">COVID-19 Response</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Airbnb.org</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Against Discrimination</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Invite Friends</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Gift Cards</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Host Your Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Host an Experience</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Responsible Hosting</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Resource Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Newsroom</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Investors</a></li>
              <li><a href="#" className="text-gray-600 hover:text-airbnb-primary">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-600 hover:text-airbnb-primary">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-airbnb-primary">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-airbnb-primary">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-airbnb-primary">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
            
            <div className="flex items-center text-gray-600">
              <span>Made with</span>
              <Heart className="h-4 w-4 mx-1 text-airbnb-primary" />
              <span>by Airbnb Clone</span>
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
