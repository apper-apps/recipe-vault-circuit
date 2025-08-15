import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import RecipeForm from "@/components/organisms/RecipeForm";
import { useRecipes } from "@/hooks/useRecipes";

const AddRecipePage = () => {
  const navigate = useNavigate();
  const { createRecipe } = useRecipes();

  const handleSubmit = async (formData) => {
    try {
      await createRecipe(formData);
      toast.success("Recipe added successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to add recipe");
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Add New Recipe
          </h1>
          <p className="text-gray-600">
            Share your favorite recipe with detailed instructions and ingredients.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <RecipeForm onSubmit={handleSubmit} />
        </div>
      </div>
    </Layout>
  );
};

export default AddRecipePage;