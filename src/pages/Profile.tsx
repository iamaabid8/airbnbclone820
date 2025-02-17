
import { User, Settings, BookOpen, Home, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-airbnb-primary font-heading text-2xl font-bold">
            airbnb
          </Link>
        </div>
      </nav>

      <div className="container mx-auto pt-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-airbnb-dark mb-2">
                  John Doe
                </h1>
                <p className="text-airbnb-light">
                  Member since 2024
                </p>
              </div>
              <Button variant="outline" className="ml-auto">
                <Settings className="w-5 h-5 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ul className="space-y-4">
                  <li>
                    <a href="#" className="flex items-center text-airbnb-dark hover:text-airbnb-primary">
                      <BookOpen className="w-5 h-5 mr-3" />
                      My Bookings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-airbnb-dark hover:text-airbnb-primary">
                      <Home className="w-5 h-5 mr-3" />
                      My Listings
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center text-airbnb-dark hover:text-airbnb-primary">
                      <Heart className="w-5 h-5 mr-3" />
                      Saved
                    </a>
                  </li>
                  <li>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign Out
                    </Button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-airbnb-dark mb-6">
                  My Bookings
                </h2>
                
                {/* Booking Cards */}
                <div className="space-y-6">
                  {[1, 2].map((booking) => (
                    <div key={booking} className="flex flex-col md:flex-row border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="w-full md:w-48 aspect-video md:aspect-square bg-gray-200 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                        <img
                          src={`https://images.unsplash.com/photo-${1649972904349 + booking}`}
                          alt={`Booking ${booking}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-airbnb-dark mb-2">
                          Luxury Villa {booking}
                        </h3>
                        <p className="text-airbnb-light mb-4">
                          Check-in: March {booking + 14}, 2024
                          <br />
                          Check-out: March {booking + 17}, 2024
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-airbnb-dark font-semibold">
                            $299 per night
                          </span>
                          <Button variant="outline">View Details</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
