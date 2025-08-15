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
  }
};