
import React from "react";
import { ImageOff } from "lucide-react";

export const NoPropertiesFound = () => {
  return (
    <div className="text-center py-12">
      <ImageOff className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-lg text-gray-600">No properties found</p>
    </div>
  );
};
