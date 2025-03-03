
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { type PropertyFilters } from "@/components/PropertySearch";
import { Navigation } from "@/components/Navigation";
import { Categories } from "@/components/Categories";
import { PropertiesGrid } from "@/components/PropertiesGrid";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";

const Index = () => {
  const [filters, setFilters] = useState<PropertyFilters | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { properties, isLoading: propertiesLoading, refetch } = useProperties(filters, selectedCategory);

  // Log key state variables to help with debugging
  useEffect(() => {
    console.log("Auth state:", { user: !!user, isAdmin, authLoading });
    console.log("Properties state:", { count: properties?.length, propertiesLoading });
  }, [user, isAdmin, authLoading, properties, propertiesLoading]);

  // Refetch properties when auth state changes or filters/category changes
  useEffect(() => {
    console.log("Triggering properties refetch...");
    refetch();
  }, [authLoading, user, filters, selectedCategory, refetch]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSearch = (newFilters: PropertyFilters) => {
    console.log("Search filters applied:", newFilters);
    setFilters(newFilters);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    setFilters(null);
  };

  const handleDeleteProperty = () => {
    console.log("Property deleted, refreshing list...");
    refetch();
  };

  // Only show loading state on initial load, not on refetch
  const isLoading = authLoading && propertiesLoading;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navigation user={user} onLogout={handleLogout} />
      <Hero onSearch={handleSearch} />
      <Categories 
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      <PropertiesGrid
        properties={properties}
        isLoading={isLoading}
        selectedCategory={selectedCategory}
        filters={filters}
        isAdmin={isAdmin}
        onDelete={handleDeleteProperty}
      />
      <Footer />
    </div>
  );
};

export default Index;
