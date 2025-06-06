import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login flow
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          throw signInError;
        }

        if (signInData.user) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate("/");
        }
      } else {
        // Sign up flow
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
            },
          },
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          throw signUpError;
        }

        if (signUpData.user) {
          // Sign in immediately after successful signup
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            console.error('Auto sign in error:', signInError);
            toast({
              title: "Sign in failed",
              description: "Account created but automatic sign in failed. Please try signing in manually.",
              variant: "destructive",
            });
            setIsLogin(true);
            return;
          }

          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
          
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
        <div className="container mx-auto">
          <Link to="/" className="text-airbnb-primary font-heading text-2xl font-bold">
            Homi
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center pt-20">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              {isForgotPassword 
                ? "Reset your password"
                : isLogin 
                  ? "Welcome back" 
                  : "Create your account"}
            </h2>

            {isForgotPassword ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : "Send Reset Link"}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-airbnb-primary hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAuth} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <RadioGroup defaultValue="user" onValueChange={setRole} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="user" id="user" />
                        <Label htmlFor="user">Guest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="host" id="host" />
                        <Label htmlFor="host">Host</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm text-airbnb-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="text-airbnb-primary hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="text-airbnb-primary hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
