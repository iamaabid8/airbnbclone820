
import { useState } from "react";
import { Users, Home, BookOpen, BarChart, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-airbnb-primary font-heading text-2xl font-bold">
            airbnb admin
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen pt-20">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm fixed h-full">
          <div className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "dashboard"
                    ? "bg-airbnb-primary text-white"
                    : "text-airbnb-dark hover:bg-gray-100"
                }`}
              >
                <BarChart className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("properties")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "properties"
                    ? "bg-airbnb-primary text-white"
                    : "text-airbnb-dark hover:bg-gray-100"
                }`}
              >
                <Home className="w-5 h-5 mr-3" />
                Properties
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "users"
                    ? "bg-airbnb-primary text-white"
                    : "text-airbnb-dark hover:bg-gray-100"
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "bookings"
                    ? "bg-airbnb-primary text-white"
                    : "text-airbnb-dark hover:bg-gray-100"
                }`}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">
          {activeTab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold text-airbnb-dark mb-8">Dashboard Overview</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { title: "Total Properties", value: "156", icon: Home },
                  { title: "Active Users", value: "2,434", icon: Users },
                  { title: "Total Bookings", value: "1,678", icon: BookOpen },
                  { title: "Revenue", value: "$45,289", icon: BarChart },
                ].map((stat) => (
                  <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="w-8 h-8 text-airbnb-primary" />
                      <span className="text-2xl font-bold text-airbnb-dark">{stat.value}</span>
                    </div>
                    <h3 className="text-airbnb-light">{stat.title}</h3>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-airbnb-dark mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          <Users className="w-5 h-5 text-airbnb-primary" />
                        </div>
                        <div>
                          <p className="text-airbnb-dark font-medium">New booking received</p>
                          <p className="text-airbnb-light text-sm">2 minutes ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "properties" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-airbnb-dark">Properties</h1>
                <Button className="bg-airbnb-primary hover:bg-airbnb-primary/90">
                  Add New Property
                </Button>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="w-5 h-5 text-airbnb-light absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search properties..."
                      className="pl-10"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Filter</Button>
                    <Button variant="outline">Sort</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3].map((property) => (
                    <div key={property} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
                          <img
                            src={`https://images.unsplash.com/photo-${1649972904349 + property}`}
                            alt={`Property ${property}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-airbnb-dark">Luxury Villa {property}</h3>
                          <p className="text-airbnb-light">New York, USA</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h1 className="text-2xl font-bold text-airbnb-dark mb-8">User Management</h1>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="w-5 h-5 text-airbnb-light absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3, 4].map((user) => (
                    <div key={user} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                          <img
                            src={`https://i.pravatar.cc/150?img=${user}`}
                            alt={`User ${user}`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-airbnb-dark">User {user}</h3>
                          <p className="text-airbnb-light">user{user}@example.com</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          Suspend
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h1 className="text-2xl font-bold text-airbnb-dark mb-8">Booking Management</h1>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="w-5 h-5 text-airbnb-light absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      placeholder="Search bookings..."
                      className="pl-10"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">Filter by Status</Button>
                    <Button variant="outline">Sort by Date</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2, 3, 4].map((booking) => (
                    <div key={booking} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4">
                          <img
                            src={`https://images.unsplash.com/photo-${1649972904349 + booking}`}
                            alt={`Booking ${booking}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-airbnb-dark">Booking #{booking}001</h3>
                          <p className="text-airbnb-light">Check-in: March {booking + 14}, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                          Confirmed
                        </span>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
