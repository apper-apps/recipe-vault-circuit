import categoriesData from "@/services/mockData/categories.json";
import { recipeService } from "@/services/api/recipeService";

let categories = [...categoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  async getAll() {
    await delay(200);
    const recipes = await recipeService.getAll();
    
    // Count recipes per category
    const categoriesWithCount = categories.map(category => {
      const count = recipes.filter(recipe => 
        recipe.categories.includes(category.name)
      ).length;
      
      return {
        ...category,
        count
      };
    });
    
    return categoriesWithCount;
  },

  async getById(id) {
    await delay(150);
    const category = categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(250);
    const maxId = categories.length > 0 ? Math.max(...categories.map(c => c.Id)) : 0;
    const newCategory = {
      ...categoryData,
      Id: maxId + 1
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    categories[index] = {
      ...categories[index],
      ...categoryData,
      Id: parseInt(id)
    };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    const deletedCategory = categories[index];
    categories.splice(index, 1);
    return { ...deletedCategory };
  }
};