
import React from "react";

interface AvailabilityBadgeProps {
  isAvailable: boolean;
  className?: string;
}

export const AvailabilityBadge = ({ isAvailable, className = "" }: AvailabilityBadgeProps) => {
  return (
    <div
      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold z-10 ${
        isAvailable
          ? "bg-green-500 text-white"
          : "bg-red-500 text-white"
      } ${className}`}
    >
      {isAvailable ? "Available" : "Unavailable"}
    </div>
  );
};
