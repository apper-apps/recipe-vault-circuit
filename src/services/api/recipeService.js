import recipesData from "@/services/mockData/recipes.json";

let recipes = [...recipesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const recipeService = {
  async getAll() {
    await delay(300);
    return [...recipes];
  },

  async getById(id) {
    await delay(200);
    const recipe = recipes.find(r => r.Id === parseInt(id));
    if (!recipe) {
      throw new Error("Recipe not found");
    }
    return { ...recipe };
  },

  async create(recipeData) {
    await delay(400);
    const maxId = recipes.length > 0 ? Math.max(...recipes.map(r => r.Id)) : 0;
    const newRecipe = {
      ...recipeData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    recipes.push(newRecipe);
    return { ...newRecipe };
  },

  async update(id, recipeData) {
    await delay(300);
    const index = recipes.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Recipe not found");
    }
    
    recipes[index] = {
      ...recipes[index],
      ...recipeData,
      Id: parseInt(id)
    };
    return { ...recipes[index] };
  },

  async delete(id) {
    await delay(250);
    const index = recipes.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Recipe not found");
    }
    
    const deletedRecipe = recipes[index];
    recipes.splice(index, 1);
    return { ...deletedRecipe };
  },

  async search(query) {
    await delay(250);
    if (!query || query.trim() === "") {
      return [...recipes];
    }
    
    const searchTerm = query.toLowerCase().trim();
    return recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
    );
  },

  async getByCategory(category) {
    await delay(200);
    if (!category) {
      return [...recipes];
    }
    
return recipes.filter(recipe => 
      recipe.categories.includes(category.toLowerCase())
    );
  },

async generateRecipe(prompt) {
    await delay(2000); // Simulate AI processing time
    
    // Import AI service for recipe generation
    const { aiRecipeService } = await import("@/services/api/aiRecipeService");
    return await aiRecipeService.generateRecipe(prompt);
  },

  async importFromPinterest(url) {
    // Validate Pinterest URL
    if (!url || !url.includes('pinterest.com')) {
      throw new Error('Please provide a valid Pinterest URL');
    }

    await delay(1500); // Simulate API processing time

    // Mock extracted recipe data - in real implementation, this would
// Mock extracted recipe data - in real implementation, this would
// scrape the Pinterest page or use Pinterest API
const extractedRecipe = {
Id: recipes.length + 1,
title: 'Imported Pinterest Recipe',
      ingredients: [
        '2 cups all-purpose flour',
        '1 tsp baking powder',
        '1/2 tsp salt',
        '1 cup sugar',
        '2 large eggs',
        '1 cup milk',
        '1/2 cup vegetable oil'
      ],
      instructions: [
        'Preheat oven to 350°F (175°C)',
        'Mix dry ingredients in a large bowl',
        'Combine wet ingredients in a separate bowl',
        'Fold wet ingredients into dry ingredients',
        'Pour into prepared baking dish',
        'Bake for 25-30 minutes until golden brown'
      ],
      prepTime: '15 minutes',
      cookTime: '30 minutes',
      servings: 8,
      difficulty: 'Medium',
      categoryId: 1,
      sourceUrl: url,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop',
      createdAt: new Date().toISOString()
    };
// Add to mock data
recipes.unshift(extractedRecipe);

return extractedRecipe;
  }
};