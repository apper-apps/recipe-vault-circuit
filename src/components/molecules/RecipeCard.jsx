import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipe.Id}`);
  };

  return (
    <Card 
      className="recipe-card cursor-pointer overflow-hidden group"
      onClick={handleClick}
    >
      {recipe.imageUrl ? (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <ApperIcon name="ChefHat" size={48} className="text-primary/40" />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        
        {recipe.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          {recipe.prepTime && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={16} />
              <span>{recipe.prepTime}m prep</span>
            </div>
          )}
          {recipe.cookTime && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Flame" size={16} />
              <span>{recipe.cookTime}m cook</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Users" size={16} />
              <span>{recipe.servings} servings</span>
            </div>
          )}
        </div>
        
        {recipe.categories && recipe.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
              >
                {category}
              </span>
            ))}
            {recipe.categories.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{recipe.categories.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecipeCard;