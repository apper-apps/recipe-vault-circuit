import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { recipeService } from "@/services/api/recipeService";
import { shoppingListService } from "@/services/api/shoppingListService";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingToShoppingList, setAddingToShoppingList] = useState(false);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      setError("");
const data = await recipeService.getById(id);
      setRecipe(data);
      setServingMultiplier(1); // Reset multiplier when loading new recipe
    } catch (err) {
      setError(err.message || "Failed to load recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToShoppingList = async () => {
    try {
      setAddingToShoppingList(true);
      await shoppingListService.generateFromRecipes([parseInt(id)]);
      toast.success("Recipe added to shopping list!");
      navigate("/shopping-list");
    } catch (error) {
      toast.error("Failed to add to shopping list");
    } finally {
      setAddingToShoppingList(false);
    }
  };
const scaleIngredient = (ingredient, multiplier) => {
    if (multiplier === 1) return ingredient;
    
    // Common fraction mappings
    const fractionMap = {
      '1/4': 0.25, '1/3': 0.333, '1/2': 0.5, '2/3': 0.667, '3/4': 0.75,
      '¼': 0.25, '⅓': 0.333, '½': 0.5, '⅔': 0.667, '¾': 0.75
    };
    
    // Reverse fraction mapping for display
    const reversefractionMap = {
      0.25: '1/4', 0.333: '1/3', 0.5: '1/2', 0.667: '2/3', 0.75: '3/4'
    };
    
    // Try to find and scale numbers in the ingredient
    return ingredient.replace(/(\d+(?:\.\d+)?|\d*\s*(?:1\/4|1\/3|1\/2|2\/3|3\/4|¼|⅓|½|⅔|¾))/g, (match) => {
      let value;
      const trimmedMatch = match.trim();
      
      // Handle fractions
      if (fractionMap[trimmedMatch]) {
        value = fractionMap[trimmedMatch];
      } else if (trimmedMatch.includes('/')) {
        const parts = trimmedMatch.split('/');
        value = parseFloat(parts[0]) / parseFloat(parts[1]);
      } else {
        value = parseFloat(trimmedMatch);
      }
      
      if (isNaN(value)) return match;
      
      const scaledValue = value * multiplier;
      
      // Format the result nicely
      if (scaledValue % 1 === 0) {
        return scaledValue.toString();
      } else if (reversefractionMap[scaledValue]) {
        return reversefractionMap[scaledValue];
      } else if (scaledValue < 1) {
        // Convert to fraction if possible
        const decimal = scaledValue % 1;
        if (Math.abs(decimal - 0.25) < 0.01) return '1/4';
        if (Math.abs(decimal - 0.333) < 0.01) return '1/3';
        if (Math.abs(decimal - 0.5) < 0.01) return '1/2';
        if (Math.abs(decimal - 0.667) < 0.01) return '2/3';
        if (Math.abs(decimal - 0.75) < 0.01) return '3/4';
        return scaledValue.toFixed(2).replace(/\.?0+$/, '');
      } else {
        return scaledValue.toFixed(2).replace(/\.?0+$/, '');
      }
    });
  };

  const handleServingMultiplier = (multiplier) => {
    setServingMultiplier(multiplier);
    toast.success(`Recipe scaled to ${multiplier}x servings`);
  };

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><Error message={error} onRetry={loadRecipe} /></Layout>;
  if (!recipe) return <Layout><Error message="Recipe not found" /></Layout>;
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start gap-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mt-1"
          >
            <ApperIcon name="ArrowLeft" size={18} />
            Back to Recipes
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-lg text-gray-600 mb-4">{recipe.description}</p>
            )}
            <div className="flex items-center gap-6 text-sm text-gray-500">
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
                  <span>
                    {Math.round(recipe.servings * servingMultiplier)} servings
                    {servingMultiplier !== 1 && (
                      <span className="text-primary ml-1 font-medium">
                        ({servingMultiplier}x)
                      </span>
                    )}
                  </span>
                </div>
              )}
              {recipe.createdAt && (
                <div className="flex items-center gap-1">
                  <ApperIcon name="Calendar" size={16} />
                  <span>Added {formatDistanceToNow(new Date(recipe.createdAt))} ago</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image */}
            {recipe.imageUrl && (
              <Card className="overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-64 object-cover"
                />
              </Card>
            )}

            {/* Instructions */}
            <Card className="p-6">
              <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="List" size={24} />
                Instructions
              </h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card className="p-6">
              <div className="space-y-3">
                <Button
                  onClick={handleAddToShoppingList}
                  disabled={addingToShoppingList}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ApperIcon name="ShoppingCart" size={18} />
                  {addingToShoppingList ? "Adding..." : "Add to Shopping List"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/edit-recipe/${id}`)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ApperIcon name="Edit" size={18} />
                  Edit Recipe
                </Button>
              </div>
            </Card>

            {/* Ingredients */}
            <Card className="p-6">
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Package" size={20} />
                Ingredients
              </h2>
              <div className="space-y-3">
<div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Serving Size:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((multiplier) => (
                      <Button
                        key={multiplier}
                        variant={servingMultiplier === multiplier ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleServingMultiplier(multiplier)}
                        className="px-3 py-1 text-xs min-w-[2.5rem]"
                      >
                        {multiplier}X
                      </Button>
                    ))}
                  </div>
                </div>
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="custom-checkbox mt-0.5"
                      id={`ingredient-${index}`}
                    />
                    <label 
                      htmlFor={`ingredient-${index}`}
                      className="text-gray-700 leading-relaxed cursor-pointer"
                    >
                      {scaleIngredient(ingredient, servingMultiplier)}
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            {/* Categories */}
            {recipe.categories && recipe.categories.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ApperIcon name="Tags" size={20} />
                  Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.categories.map((category, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetailPage;