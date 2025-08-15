import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { shoppingListService } from "@/services/api/shoppingListService";
import { recipeService } from "@/services/api/recipeService";
import ApperIcon from "@/components/ApperIcon";

const ShoppingListPage = () => {
  const navigate = useNavigate();
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [generatingList, setGeneratingList] = useState(false);

  const loadShoppingLists = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await shoppingListService.getAll();
      setShoppingLists(data);
    } catch (err) {
      setError(err.message || "Failed to load shopping lists");
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async () => {
    try {
      const recipes = await recipeService.getAll();
      setAvailableRecipes(recipes);
    } catch (err) {
      console.error("Failed to load recipes:", err);
    }
  };

  const toggleRecipeSelection = (recipeId) => {
    setSelectedRecipes(prev => 
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const generateShoppingList = async () => {
    if (selectedRecipes.length === 0) {
      toast.error("Please select at least one recipe");
      return;
    }

    try {
      setGeneratingList(true);
      await shoppingListService.generateFromRecipes(selectedRecipes);
      toast.success("Shopping list generated successfully!");
      setSelectedRecipes([]);
      setShowRecipeSelector(false);
      await loadShoppingLists();
    } catch (error) {
      toast.error("Failed to generate shopping list");
    } finally {
      setGeneratingList(false);
    }
  };

  const toggleIngredientComplete = async (listId, ingredientIndex) => {
    try {
      const list = shoppingLists.find(l => l.Id === listId);
      const ingredient = list.ingredients[ingredientIndex];
      
      await shoppingListService.updateIngredient(
        listId, 
        ingredientIndex, 
        { completed: !ingredient.completed }
      );
      
      setShoppingLists(prev => prev.map(l => {
        if (l.Id === listId) {
          const updatedIngredients = [...l.ingredients];
          updatedIngredients[ingredientIndex] = {
            ...updatedIngredients[ingredientIndex],
            completed: !updatedIngredients[ingredientIndex].completed
          };
          return { ...l, ingredients: updatedIngredients };
        }
        return l;
      }));
    } catch (error) {
      toast.error("Failed to update ingredient");
    }
  };

  const deleteShoppingList = async (listId) => {
    if (window.confirm("Are you sure you want to delete this shopping list?")) {
      try {
        await shoppingListService.delete(listId);
        setShoppingLists(prev => prev.filter(l => l.Id !== listId));
        toast.success("Shopping list deleted");
      } catch (error) {
        toast.error("Failed to delete shopping list");
      }
    }
  };

  const getRecipeName = (recipeId) => {
    const recipe = availableRecipes.find(r => r.Id === recipeId);
    return recipe ? recipe.title : `Recipe ${recipeId}`;
  };

  useEffect(() => {
    loadShoppingLists();
    loadRecipes();
  }, []);

  if (loading) return <Layout><Loading /></Layout>;
  if (error) return <Layout><Error message={error} onRetry={loadShoppingLists} /></Layout>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Shopping Lists
            </h1>
            <p className="text-gray-600 mt-1">
              Generate shopping lists from your favorite recipes
            </p>
          </div>
          <Button 
            onClick={() => setShowRecipeSelector(true)}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <ApperIcon name="Plus" size={18} />
            Create List
          </Button>
        </div>

        {/* Recipe Selector Modal */}
        {showRecipeSelector && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-semibold text-gray-900">
                Select Recipes
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowRecipeSelector(false)}
              >
                <ApperIcon name="X" size={18} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {availableRecipes.map(recipe => (
                <button
                  key={recipe.Id}
                  onClick={() => toggleRecipeSelection(recipe.Id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedRecipes.includes(recipe.Id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center ${
                      selectedRecipes.includes(recipe.Id)
                        ? "bg-primary border-primary text-white"
                        : "border-gray-300"
                    }`}>
                      {selectedRecipes.includes(recipe.Id) && (
                        <ApperIcon name="Check" size={12} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{recipe.ingredients?.length || 0} ingredients</span>
                        {recipe.servings && <span>• {recipe.servings} servings</span>}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedRecipes.length} recipes selected
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedRecipes([]);
                    setShowRecipeSelector(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateShoppingList}
                  disabled={generatingList || selectedRecipes.length === 0}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="ShoppingCart" size={16} />
                  {generatingList ? "Generating..." : "Create List"}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Shopping Lists */}
        {shoppingLists.length === 0 ? (
          <Empty 
            title="No shopping lists yet"
            message="Create your first shopping list by selecting recipes and generating ingredients automatically!"
            showAddButton={false}
          />
        ) : (
          <div className="space-y-6">
            {shoppingLists.map((list) => {
              const completedCount = list.ingredients.filter(ing => ing.completed).length;
              const totalCount = list.ingredients.length;
              const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
              
              return (
                <Card key={list.Id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
                        Shopping List from {new Date(list.createdAt).toLocaleDateString()}
                      </h3>
                      
                      {/* Recipe Sources */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {list.recipes.map(recipeId => (
                          <button
                            key={recipeId}
                            onClick={() => navigate(`/recipe/${recipeId}`)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                          >
                            <ApperIcon name="BookOpen" size={12} />
                            {getRecipeName(recipeId)}
                          </button>
                        ))}
                      </div>
                      
                      {/* Progress */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{completedCount} of {totalCount} items completed</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                        <span>{Math.round(completionPercentage)}%</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteShoppingList(list.Id)}
                      className="p-2 text-gray-400 hover:text-error transition-colors"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                  
                  {/* Ingredients */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {list.ingredients.map((ingredient, index) => (
                      <div 
                        key={index}
                        className={`flex items-center gap-3 p-2 rounded transition-all ${
                          ingredient.completed ? "bg-gray-50 text-gray-500" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={ingredient.completed}
                          onChange={() => toggleIngredientComplete(list.Id, index)}
                          className="custom-checkbox"
                        />
                        <span className={`flex-1 ${ingredient.completed ? "line-through" : ""}`}>
                          {ingredient.name}
                          {ingredient.amount && ` (${ingredient.amount})`}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShoppingListPage;