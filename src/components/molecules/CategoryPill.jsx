import React from "react";
import { cn } from "@/utils/cn";

const CategoryPill = ({ category, isActive, onClick, showCount }) => {
  return (
    <button
      onClick={() => onClick(category.name)}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
        "hover:shadow-md hover:scale-105",
        isActive 
          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md" 
          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      )}
    >
      <div 
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: category.color || "#E85D04" }}
      />
      {category.name}
      {showCount && (
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          isActive ? "bg-white/20" : "bg-gray-100"
        )}>
          {category.count || 0}
        </span>
      )}
    </button>
  );
};

export default CategoryPill;