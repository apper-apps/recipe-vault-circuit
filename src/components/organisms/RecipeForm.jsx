import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ImageUpload from "@/components/molecules/ImageUpload";
import ApperIcon from "@/components/ApperIcon";

const RecipeForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    prepTime: initialData?.prepTime || "",
    cookTime: initialData?.cookTime || "",
    servings: initialData?.servings || "",
    categories: initialData?.categories?.join(", ") || "",
    ingredients: initialData?.ingredients?.join("\n") || "",
    instructions: initialData?.instructions?.join("\n") || "",
    imageUrl: initialData?.imageUrl || ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Recipe title is required";
    }
    
    if (!formData.ingredients.trim()) {
      newErrors.ingredients = "Ingredients are required";
    }
    
    if (!formData.instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    }
    
    if (formData.prepTime && isNaN(Number(formData.prepTime))) {
      newErrors.prepTime = "Prep time must be a number";
    }
    
    if (formData.cookTime && isNaN(Number(formData.cookTime))) {
      newErrors.cookTime = "Cook time must be a number";
    }
    
    if (formData.servings && isNaN(Number(formData.servings))) {
      newErrors.servings = "Servings must be a number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const processedData = {
      ...formData,
      prepTime: formData.prepTime ? Number(formData.prepTime) : null,
      cookTime: formData.cookTime ? Number(formData.cookTime) : null,
      servings: formData.servings ? Number(formData.servings) : null,
      categories: formData.categories
        .split(",")
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0),
      ingredients: formData.ingredients
        .split("\n")
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0),
      instructions: formData.instructions
        .split("\n")
        .map(inst => inst.trim())
        .filter(inst => inst.length > 0)
    };
    
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <FormField
            label="Recipe Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="Enter recipe title..."
          />

          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            multiline
            rows={3}
            placeholder="Brief description of the recipe..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              label="Prep Time (minutes)"
              name="prepTime"
              type="number"
              value={formData.prepTime}
              onChange={handleChange}
              error={errors.prepTime}
              placeholder="30"
            />
            
            <FormField
              label="Cook Time (minutes)"
              name="cookTime"
              type="number"
              value={formData.cookTime}
              onChange={handleChange}
              error={errors.cookTime}
              placeholder="45"
            />
            
            <FormField
              label="Servings"
              name="servings"
              type="number"
              value={formData.servings}
              onChange={handleChange}
              error={errors.servings}
              placeholder="4"
            />
          </div>

          <FormField
            label="Categories"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            error={errors.categories}
            placeholder="dinner, italian, pasta (comma-separated)"
          />

          <FormField
            label="Ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            error={errors.ingredients}
            multiline
            rows={8}
            required
            placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup milk&#10;(one ingredient per line)"
          />

          <FormField
            label="Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            error={errors.instructions}
            multiline
            rows={10}
            required
            placeholder="1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients&#10;(one step per line)"
          />
        </div>

        {/* Image Upload Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Image" size={20} />
              Recipe Image
            </h3>
            <ImageUpload
              onImageSelect={(imageUrl) => setFormData(prev => ({ ...prev, imageUrl }))}
              currentImage={formData.imageUrl}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <ApperIcon name="Save" size={18} />
          Save Recipe
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;