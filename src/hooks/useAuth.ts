
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        console.log("Checking user auth status...");
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setIsLoading(false);
          return;
        }
        
        // Set the user state
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        console.log("Current user:", currentUser ? "Logged in" : "Not logged in");
        
        if (currentUser) {
          // Get user profile data
          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentUser.id)
            .single();
          
          if (profileError) {
            console.error("Error getting user profile:", profileError);
            setIsAdmin(false);
          } else {
            const isUserAdmin = data?.role === 'admin';
            setIsAdmin(isUserAdmin);
            console.log("User is admin:", isUserAdmin);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Unexpected error in useAuth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { event, hasUser: !!session?.user });
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      if (newUser) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', newUser.id)
            .single();
          
          if (error) {
            console.error("Error getting user profile on auth change:", error);
            setIsAdmin(false);
          } else {
            const isUserAdmin = data?.role === 'admin';
            setIsAdmin(isUserAdmin);
            console.log("User admin status updated:", isUserAdmin);
          }
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, isLoading };
}
