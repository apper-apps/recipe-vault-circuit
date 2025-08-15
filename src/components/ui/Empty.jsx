import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No recipes found", 
  message = "Start building your recipe collection by adding your first recipe!",
  showAddButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="ChefHat" size={40} className="text-primary/60" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {showAddButton && (
        <Button 
          onClick={() => navigate("/add-recipe")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Your First Recipe
        </Button>
      )}
    </div>
  );
};

export default Empty;