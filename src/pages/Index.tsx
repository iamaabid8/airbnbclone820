
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
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
  const { user, isAdmin } = useAuth();
  const { properties, isLoading, refetch } = useProperties(filters, selectedCategory);

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
    console.log("Search filters:", newFilters);
    setFilters(newFilters);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFilters(null);
  };

  const handleDeleteProperty = () => {
    refetch();
  };

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
