import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/organisms/Layout";
import RecipeGrid from "@/components/organisms/RecipeGrid";
import CategoryPill from "@/components/molecules/CategoryPill";
import Button from "@/components/atoms/Button";
import { useRecipes } from "@/hooks/useRecipes";
import { useCategories } from "@/hooks/useCategories";
import ApperIcon from "@/components/ApperIcon";

const RecipesPage = () => {
  const navigate = useNavigate();
  const { recipes, loading, error, searchRecipes, filterByCategory, loadRecipes } = useRecipes();
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryFilter = async (categoryName) => {
    if (activeCategory === categoryName) {
      setActiveCategory("");
      await loadRecipes();
    } else {
      setActiveCategory(categoryName);
      await filterByCategory(categoryName);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setActiveCategory("");
    if (query.trim()) {
      await searchRecipes(query);
    } else {
      await loadRecipes();
    }
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Your Recipe Collection
            </h1>
            <p className="text-gray-600 mt-1">
              {searchQuery ? `Search results for "${searchQuery}"` : 
               activeCategory ? `Recipes in ${activeCategory}` : 
               `${recipes.length} recipes in your collection`}
            </p>
</div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate("/import-recipe")}
              className="flex items-center gap-2 whitespace-nowrap bg-accent text-gray-900 hover:bg-accent/90"
            >
              <ApperIcon name="Download" size={18} />
              Import Recipe
            </Button>
            <Button 
              onClick={() => navigate("/add-recipe")}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <ApperIcon name="Plus" size={18} />
              Add Recipe
            </Button>
          </div>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories
                .filter(cat => cat.count > 0)
                .sort((a, b) => b.count - a.count)
                .map((category) => (
                  <CategoryPill
                    key={category.Id}
                    category={category}
                    isActive={activeCategory === category.name}
                    onClick={handleCategoryFilter}
                    showCount={true}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <RecipeGrid 
          recipes={recipes}
          loading={loading}
          error={error}
          onRetry={loadRecipes}
        />
      </div>
    </Layout>
  );
};

export default RecipesPage;