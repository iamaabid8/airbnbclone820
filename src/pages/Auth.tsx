
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
        <div className="container mx-auto">
          <Link to="/" className="text-airbnb-primary font-heading text-2xl font-bold">
            airbnb
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center pt-24 px-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-airbnb-dark mb-6 text-center">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>

            <form className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-airbnb-dark mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-airbnb-dark mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-airbnb-dark mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Button className="w-full bg-airbnb-primary hover:bg-airbnb-primary/90 text-white">
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-airbnb-primary hover:underline"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
