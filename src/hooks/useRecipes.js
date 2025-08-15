import { useState, useEffect } from "react";
import { recipeService } from "@/services/api/recipeService";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await recipeService.getAll();
      setRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async (query) => {
    try {
      setLoading(true);
      setError("");
      const data = await recipeService.search(query);
      setRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to search recipes");
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (category) => {
    try {
      setLoading(true);
      setError("");
      const data = await recipeService.getByCategory(category);
      setRecipes(data);
    } catch (err) {
      setError(err.message || "Failed to filter recipes");
    } finally {
      setLoading(false);
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      const newRecipe = await recipeService.create(recipeData);
      setRecipes(prev => [newRecipe, ...prev]);
      return newRecipe;
    } catch (err) {
      throw new Error(err.message || "Failed to create recipe");
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await recipeService.delete(id);
      setRecipes(prev => prev.filter(r => r.Id !== parseInt(id)));
    } catch (err) {
      throw new Error(err.message || "Failed to delete recipe");
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  return {
    recipes,
    loading,
    error,
    loadRecipes,
    searchRecipes,
    filterByCategory,
    createRecipe,
    deleteRecipe
  };
};