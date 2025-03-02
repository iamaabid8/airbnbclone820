
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCurrentUser() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          setCurrentUserId(null);
          return;
        }
        
        // Set the user ID if a session exists
        if (data.session) {
          setCurrentUserId(data.session.user.id);
        } else {
          setCurrentUserId(null);
        }
      } catch (error) {
        console.error("Unexpected error fetching session:", error);
        setCurrentUserId(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();
  }, []);

  return { currentUserId, isLoading };
}
