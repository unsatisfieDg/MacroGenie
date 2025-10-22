// API Keys from environment variables
const EDAMAM_FOOD_APP_ID = import.meta.env.VITE_EDAMAM_FOOD_APP_ID;
const EDAMAM_FOOD_APP_KEY = import.meta.env.VITE_EDAMAM_FOOD_APP_KEY;
const EDAMAM_RECIPE_APP_ID = import.meta.env.VITE_EDAMAM_RECIPE_APP_ID;
const EDAMAM_RECIPE_APP_KEY = import.meta.env.VITE_EDAMAM_RECIPE_APP_KEY;

// Validate API keys are configured
if (!EDAMAM_FOOD_APP_ID || !EDAMAM_FOOD_APP_KEY) {
  console.warn('⚠️ Edamam Food API keys not configured. Food search will use local database only.');
}

if (!EDAMAM_RECIPE_APP_ID || !EDAMAM_RECIPE_APP_KEY) {
  console.warn('⚠️ Edamam Recipe API keys not configured. Recipe search may not work.');
}

export const searchFood = async (query) => {
  try {
    const response = await fetch(
      `https://api.edamam.com/api/food-database/v2/parser?app_id=${EDAMAM_FOOD_APP_ID}&app_key=${EDAMAM_FOOD_APP_KEY}&ingr=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    if (data.hints) {
      return data.hints.slice(0, 5).map(hint => ({
        name: hint.food.label,
        calories: hint.food.nutrients.ENERC_KCAL || 0,
        protein: hint.food.nutrients.PROCNT || 0,
        carbs: hint.food.nutrients.CHOCDF || 0,
        fats: hint.food.nutrients.FAT || 0
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching food data:', error);
    return [];
  }
};

export const searchRecipes = async (ingredients) => {
  try {
    // Fetch more recipes to have a larger pool for filtering
    const response = await fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(ingredients)}&app_id=${EDAMAM_RECIPE_APP_ID}&app_key=${EDAMAM_RECIPE_APP_KEY}&to=100`
    );
    const data = await response.json();
    
    if (data.hits) {
      // Return up to 100 recipes for better filtering results
      return data.hits.map(hit => ({
        name: hit.recipe.label,
        image: hit.recipe.image,
        calories: Math.round(hit.recipe.calories / hit.recipe.yield),
        protein: Math.round(hit.recipe.totalNutrients.PROCNT?.quantity / hit.recipe.yield || 0),
        carbs: Math.round(hit.recipe.totalNutrients.CHOCDF?.quantity / hit.recipe.yield || 0),
        fats: Math.round(hit.recipe.totalNutrients.FAT?.quantity / hit.recipe.yield || 0),
        url: hit.recipe.url,
        ingredientsList: hit.recipe.ingredientLines || [] // Add ingredient lines for filtering
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};