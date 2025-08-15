import shoppingListsData from "@/services/mockData/shoppingLists.json";
import { recipeService } from "@/services/api/recipeService";

let shoppingLists = [...shoppingListsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const shoppingListService = {
  async getAll() {
    await delay(200);
    return [...shoppingLists];
  },

  async getById(id) {
    await delay(150);
    const list = shoppingLists.find(l => l.Id === parseInt(id));
    if (!list) {
      throw new Error("Shopping list not found");
    }
    return { ...list };
  },

  async create(listData) {
    await delay(300);
    const maxId = shoppingLists.length > 0 ? Math.max(...shoppingLists.map(l => l.Id)) : 0;
    const newList = {
      ...listData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    shoppingLists.push(newList);
    return { ...newList };
  },

  async generateFromRecipes(recipeIds) {
    await delay(400);
    
    const allIngredients = [];
    const recipes = [];
    
    for (const recipeId of recipeIds) {
      try {
        const recipe = await recipeService.getById(recipeId);
        recipes.push(recipe);
        
        recipe.ingredients.forEach(ingredient => {
          allIngredients.push({
            name: ingredient,
            amount: "1",
            recipeId: recipe.Id,
            completed: false
          });
        });
      } catch (error) {
        console.warn(`Recipe ${recipeId} not found`);
      }
    }
    
    // Combine similar ingredients
    const combinedIngredients = {};
    allIngredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();
      if (combinedIngredients[key]) {
        combinedIngredients[key].recipes = combinedIngredients[key].recipes || [];
        combinedIngredients[key].recipes.push(ingredient.recipeId);
      } else {
        combinedIngredients[key] = {
          ...ingredient,
          recipes: [ingredient.recipeId]
        };
      }
    });
    
    const maxId = shoppingLists.length > 0 ? Math.max(...shoppingLists.map(l => l.Id)) : 0;
    const newList = {
      Id: maxId + 1,
      recipes: recipeIds,
      ingredients: Object.values(combinedIngredients),
      createdAt: new Date().toISOString()
    };
    
    shoppingLists.push(newList);
    return { ...newList };
  },

  async updateIngredient(listId, ingredientIndex, updates) {
    await delay(150);
    const listIndex = shoppingLists.findIndex(l => l.Id === parseInt(listId));
    if (listIndex === -1) {
      throw new Error("Shopping list not found");
    }
    
    if (ingredientIndex < 0 || ingredientIndex >= shoppingLists[listIndex].ingredients.length) {
      throw new Error("Ingredient not found");
    }
    
    shoppingLists[listIndex].ingredients[ingredientIndex] = {
      ...shoppingLists[listIndex].ingredients[ingredientIndex],
      ...updates
    };
    
    return { ...shoppingLists[listIndex] };
  },

  async delete(id) {
    await delay(200);
    const index = shoppingLists.findIndex(l => l.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Shopping list not found");
    }
    
    const deletedList = shoppingLists[index];
    shoppingLists.splice(index, 1);
    return { ...deletedList };
  }
};