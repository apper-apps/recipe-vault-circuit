import React from "react";
import RecipeCard from "@/components/molecules/RecipeCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const RecipeGrid = ({ recipes, loading, error, onRetry }) => {
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;
  if (!recipes || recipes.length === 0) return <Empty />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.Id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;