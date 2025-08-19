const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// AI Recipe Generation Templates and Logic
const cuisineTypes = ['italian', 'mexican', 'asian', 'mediterranean', 'american', 'indian', 'french'];
const cookingMethods = ['baked', 'grilled', 'sautéed', 'roasted', 'steamed', 'fried'];
const dietaryTags = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'low-carb', 'healthy'];

const ingredientDatabase = {
  proteins: ['chicken breast', 'salmon', 'ground beef', 'tofu', 'eggs', 'shrimp', 'turkey', 'beans'],
  vegetables: ['broccoli', 'spinach', 'tomatoes', 'onions', 'garlic', 'bell peppers', 'carrots', 'zucchini'],
  grains: ['rice', 'pasta', 'quinoa', 'bread', 'oats', 'couscous', 'noodles'],
  dairy: ['cheese', 'milk', 'butter', 'yogurt', 'cream cheese', 'mozzarella'],
  spices: ['salt', 'pepper', 'garlic powder', 'paprika', 'oregano', 'basil', 'cumin', 'thyme'],
  oils: ['olive oil', 'vegetable oil', 'coconut oil', 'sesame oil']
};

const recipeTemplates = {
  pasta: {
    baseIngredients: ['pasta', 'olive oil', 'garlic', 'onions'],
    cookTime: 25,
    prepTime: 15,
    servings: 4,
    instructions: [
      'Bring a large pot of salted water to boil',
      'Cook pasta according to package instructions',
      'Meanwhile, heat olive oil in a large pan',
      'Add garlic and onions, sauté until fragrant',
      'Drain pasta and add to the pan',
      'Toss everything together and serve hot'
    ]
  },
  stir_fry: {
    baseIngredients: ['oil', 'garlic', 'ginger', 'soy sauce'],
    cookTime: 15,
    prepTime: 20,
    servings: 3,
    instructions: [
      'Prepare all ingredients and have them ready',
      'Heat oil in a wok or large skillet over high heat',
      'Add garlic and ginger, stir-fry for 30 seconds',
      'Add protein and cook until almost done',
      'Add vegetables in order of cooking time needed',
      'Add sauce and toss everything together',
      'Serve immediately over rice'
    ]
  },
  salad: {
    baseIngredients: ['mixed greens', 'olive oil', 'lemon juice', 'salt'],
    cookTime: 0,
    prepTime: 15,
    servings: 2,
    instructions: [
      'Wash and dry all vegetables thoroughly',
      'Chop vegetables into bite-sized pieces',
      'Combine greens in a large bowl',
      'Add other vegetables and toppings',
      'Whisk together dressing ingredients',
      'Toss salad with dressing just before serving'
    ]
  },
  soup: {
    baseIngredients: ['vegetable broth', 'onions', 'garlic', 'olive oil'],
    cookTime: 30,
    prepTime: 15,
    servings: 4,
    instructions: [
      'Heat oil in a large pot over medium heat',
      'Add onions and garlic, cook until softened',
      'Add other vegetables and cook briefly',
      'Pour in broth and bring to a boil',
      'Reduce heat and simmer until vegetables are tender',
      'Season with salt and pepper to taste',
      'Serve hot with garnishes'
    ]
  }
};

const generateRecipeFromPrompt = (prompt) => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Determine recipe type
  let recipeType = 'pasta'; // default
  if (lowerPrompt.includes('salad')) recipeType = 'salad';
  else if (lowerPrompt.includes('soup')) recipeType = 'soup';
  else if (lowerPrompt.includes('stir fry') || lowerPrompt.includes('stir-fry')) recipeType = 'stir_fry';
  
  const template = recipeTemplates[recipeType];
  
  // Generate title
  const titleWords = prompt.split(' ').slice(0, 5).join(' ');
  const title = titleWords.charAt(0).toUpperCase() + titleWords.slice(1);
  
  // Generate description
  const description = `A delicious ${recipeType.replace('_', ' ')} recipe that's perfect for any occasion. ${
    template.cookTime === 0 ? 'Fresh and healthy!' : 'Easy to make and full of flavor!'
  }`;
  
  // Generate categories
  const categories = [];
  cuisineTypes.forEach(cuisine => {
    if (lowerPrompt.includes(cuisine)) categories.push(cuisine);
  });
  dietaryTags.forEach(tag => {
    if (lowerPrompt.includes(tag) || lowerPrompt.includes(tag.replace('-', ' '))) {
      categories.push(tag);
    }
  });
  if (categories.length === 0) {
    categories.push(recipeType === 'salad' ? 'healthy' : 'comfort food');
  }
  
  // Generate ingredients
  const ingredients = [...template.baseIngredients];
  
  // Add ingredients based on prompt
  Object.keys(ingredientDatabase).forEach(category => {
    ingredientDatabase[category].forEach(ingredient => {
      if (lowerPrompt.includes(ingredient) && !ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
      }
    });
  });
  
  // Add quantities to ingredients
  const quantifiedIngredients = ingredients.map(ingredient => {
    if (ingredient === 'pasta') return '1 lb pasta';
    if (ingredient === 'rice') return '2 cups rice';
    if (ingredient === 'olive oil') return '2 tablespoons olive oil';
    if (ingredient === 'garlic') return '3 cloves garlic, minced';
    if (ingredient === 'onions') return '1 medium onion, diced';
    if (ingredient === 'salt') return 'Salt to taste';
    if (ingredient === 'pepper') return 'Black pepper to taste';
    if (ingredient.includes('cheese')) return `1/2 cup ${ingredient}, grated`;
    if (ingredient.includes('broth')) return `4 cups ${ingredient}`;
    if (ingredientDatabase.vegetables.includes(ingredient)) {
      return `1 cup ${ingredient}, chopped`;
    }
    if (ingredientDatabase.proteins.includes(ingredient)) {
      return `1 lb ${ingredient}`;
    }
    return `1 ${ingredient}`;
  });
  
  // Enhance instructions based on ingredients
  const enhancedInstructions = [...template.instructions];
  if (ingredients.includes('cheese')) {
    enhancedInstructions.push('Top with grated cheese before serving');
  }
  if (ingredients.some(ing => ingredientDatabase.spices.includes(ing))) {
    enhancedInstructions.push('Season with herbs and spices to taste');
  }
  
  // Generate image URL (placeholder)
  const imageUrl = `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&crop=food`;
  
  return {
    title,
    description,
    prepTime: template.prepTime,
    cookTime: template.cookTime,
    servings: template.servings,
    categories,
    ingredients: quantifiedIngredients,
    instructions: enhancedInstructions,
    imageUrl
  };
};

export const aiRecipeService = {
  async generateRecipe(prompt) {
    await delay(1500); // Simulate AI processing
    
    if (!prompt || prompt.trim().length < 10) {
      throw new Error("Please provide a more detailed recipe prompt");
    }
    
    try {
      const generatedRecipe = generateRecipeFromPrompt(prompt);
      return generatedRecipe;
    } catch (error) {
      throw new Error("Failed to generate recipe. Please try a different prompt.");
    }
  }
};