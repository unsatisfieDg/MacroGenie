import React, { useState } from 'react';
import { ChefHat, Search, Clock, Users, Star, ExternalLink } from 'lucide-react';
import { searchRecipes } from '../utils/api';

const RecipeFinder = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentField, setCurrentField] = useState('');

  const handleSearch = async () => {
    if (!ingredients.trim()) return;
    
    setIsSearching(true);
    try {
    const results = await searchRecipes(ingredients);
      
      // Filter recipes to only include those with the specified ingredients
      const userIngredients = ingredients.toLowerCase()
        .split(',')
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0);
      
      // SIMPLE HOME-COOKING ingredients only (no expensive/exotic items)
      const allowedCondiments = [
        // Basic Seasonings
        'salt', 'pepper', 'black pepper', 'ground pepper',
        
        // Common Cooking Oils & Fats
        'oil', 'olive oil', 'vegetable oil', 'cooking oil',
        'butter', 'margarine',
        
        // Kitchen Basics
        'water', 'ice', 'stock', 'broth', 'chicken stock', 'vegetable stock',
        
        // Everyday Aromatics
        'garlic', 'onion', 'ginger', 'green onion', 'scallion',
        
        // Common Sauces (found in most kitchens)
        'soy sauce', 'hot sauce', 'ketchup', 'mayonnaise', 'mayo',
        'vinegar', 'white vinegar',
        
        // Simple Sweeteners
        'sugar', 'brown sugar', 'honey',
        
        // Citrus (affordable)
        'lemon', 'lime', 'lemon juice', 'lime juice', 'calamansi',
        
        // Common Dried Herbs & Spices
        'parsley', 'basil', 'oregano', 'thyme',
        'cumin', 'paprika', 'chili powder', 'red pepper flakes',
        'cinnamon', 'garlic powder', 'onion powder',
        
        // Baking Basics
        'flour', 'cornstarch', 'corn starch',
        'baking powder', 'baking soda',
        
        // Common Extras
        'egg', 'eggs', 'milk', 'cream',
        
        // 🇵🇭 FILIPINO COOKING ESSENTIALS
        // Sauces & Condiments
        'fish sauce', 'patis', 'bagoong', 'shrimp paste',
        'oyster sauce', 'banana ketchup',
        
        // Vinegars & Acids
        'vinegar', 'white vinegar', 'cane vinegar', 'coconut vinegar',
        'sukang maasim', 'sukang paombong',
        
        // Souring Agents
        'tamarind', 'sampaloc', 'kamias', 'green mango',
        
        // Filipino Aromatics
        'bay leaf', 'laurel', 'lemongrass', 'tanglad',
        'ginger', 'luya', 'turmeric', 'luyang dilaw',
        
        // Filipino Staples
        'coconut milk', 'gata', 'coconut cream',
        'annatto', 'atsuete', 'achuete',
        
        // Filipino Vegetables (common & affordable)
        'tomato', 'tomatoes', 'kamatis',
        'potato', 'potatoes', 'patatas',
        'eggplant', 'talong',
        'squash', 'kalabasa',
        'bitter melon', 'ampalaya',
        'okra',
        'cabbage', 'repolyo',
        'bok choy', 'pechay',
        'string beans', 'sitaw',
        'radish', 'labanos',
        'moringa', 'malunggay',
        'water spinach', 'kangkong',
        'taro', 'gabi',
        
        // Common Filipino Ingredients
        'rice', 'bigas', 'kanin',
        'noodles', 'pancit', 'vermicelli',
        'banana', 'saba', 'plantain',
        'bell pepper', 'green pepper', 'red pepper'
      ];
      
      // EXPENSIVE/EXOTIC ingredients to EXCLUDE from recipes
      const expensiveIngredients = [
        // Expensive Proteins
        'lobster', 'scallop', 'caviar', 'venison', 'duck', 'lamb',
        'veal', 'foie gras', 'truffle', 'wagyu', 'kobe beef',
        
        // Exotic Ingredients (NOT common in Filipino cooking)
        'saffron', 'vanilla bean', 'cardamom', 'star anise', 'fennel seed',
        'tahini', 'miso', 'seaweed', 'nori', 'kombu', 'wakame',
        'galangal',
        'mirin', 'rice wine', 'sake',
        'hoisin', 'gochujang',
        
        // Fancy Cheeses
        'brie', 'camembert', 'gruyere', 'goat cheese', 'feta', 'blue cheese',
        'parmesan', 'parmigiano', 'pecorino', 'manchego',
        
        // Specialty Items
        'pine nut', 'pistachio', 'macadamia', 'almond', 'walnut', 'pecan',
        'sun-dried tomato', 'sundried tomato', 'artichoke',
        'asparagus', 'arugula', 'radicchio', 'endive',
        'quinoa', 'couscous', 'bulgur', 'farro',
        'capers', 'anchovies', 'prosciutto', 'pancetta',
        'wine', 'sherry', 'cognac', 'brandy'
      ];
      
      const filteredRecipes = results.filter(recipe => {
        // Get recipe ingredients from the API
        if (!recipe.ingredientsList) return false;
        
        const recipeIngredients = recipe.ingredientsList
          .map(ing => ing.toLowerCase().trim());
        
        // FIRST: Exclude recipes with expensive/exotic ingredients
        const hasExpensiveIngredient = recipeIngredients.some(recipeIng => 
          expensiveIngredients.some(expensive => recipeIng.includes(expensive))
        );
        
        if (hasExpensiveIngredient) {
          return false; // Skip this recipe entirely
        }
        
        // SECOND: Check if all recipe ingredients are either:
        // 1. In the user's list
        // 2. Common home-cooking condiments/seasonings
        const hasOnlyAllowedIngredients = recipeIngredients.every(recipeIng => {
          // Check if it's in user's ingredients
          const isUserIngredient = userIngredients.some(userIng => 
            recipeIng.includes(userIng) || userIng.includes(recipeIng)
          );
          
          // Check if it's a common home-cooking condiment
          const isCondiment = allowedCondiments.some(condiment => 
            recipeIng.includes(condiment)
          );
          
          return isUserIngredient || isCondiment;
        });
        
        // THIRD: Check that the recipe uses at least one of the user's main ingredients
        const usesUserIngredients = userIngredients.some(userIng => 
          recipeIngredients.some(recipeIng => 
            recipeIng.includes(userIng) || userIng.includes(recipeIng)
          )
        );
        
        return hasOnlyAllowedIngredients && usesUserIngredients;
      });
      
      setRecipes(filteredRecipes || []);
    } catch (error) {
      console.error('Recipe search error:', error);
      setRecipes([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getDifficultyColor = (calories) => {
    if (calories < 200) return 'text-green-500 bg-green-100 dark:bg-green-900/20';
    if (calories < 400) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
    return 'text-red-500 bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-6 transition-all duration-300 border border-gray-100 dark:border-white/8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="relative">
            <ChefHat className="w-6 h-6 text-orange-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
          </div>
        Recipe Finder
      </h3>
        <div className="text-sm text-gray-500 dark:text-white/70">
          Discover new meals
        </div>
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
        <textarea
            placeholder="Enter ingredients (e.g., chicken, rice, broccoli)..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
            onFocus={() => setCurrentField('ingredients')}
            className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring resize-none ${
              currentField === 'ingredients' ? 'border-orange-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
            }`}
          rows="3"
        />
        </div>
        
        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isSearching || !ingredients.trim()}
          className={`w-full group relative overflow-hidden py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 focus-ring hover-scale ${
            isSearching || !ingredients.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Finding Recipes...</span>
              </>
            ) : (
              <>
                <ChefHat className="w-5 h-5" />
                <span>Find Recipes</span>
              </>
            )}
          </div>
          {!isSearching && ingredients.trim() && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          )}
        </button>
      </div>

      {/* Recipe Results */}
      <div className="mt-6 space-y-4 max-h-[600px] overflow-y-auto">
        {recipes.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-700 mb-4 animate-fade-in-scale">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="font-bold text-gray-900 dark:text-white">
                Found {recipes.length} simple home recipe{recipes.length !== 1 ? 's' : ''}!
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🔍 Ingredients: <span className="font-semibold text-orange-600 dark:text-orange-400">"{ingredients}"</span>
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-1 font-medium">
              ✅ Simple recipes with your ingredients + common pantry items only
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              🏠 No expensive or exotic ingredients • Easy to make at home
            </p>
          </div>
        )}
        
        {recipes.map((recipe, idx) => (
          <div 
            key={idx} 
            className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-white/10 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="flex gap-4">
              {/* Recipe Image */}
              <div className="relative">
              <img
                src={recipe.image}
                alt={recipe.name}
                  className="w-20 h-20 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEMzMS4xNjM0IDIwIDI0IDI3LjE2MzQgMjQgMzZDMjQgNDQuODM2NiAzMS4xNjM0IDUyIDQwIDUyQzQ4LjgzNjYgNTIgNTYgNDQuODM2NiA1NiAzNkM1NiAyNy4xNjM0IDQ4LjgzNjYgMjAgNDAgMjBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yOCA2MEMyOCA1NS41ODE3IDMxLjU4MTcgNTIgMzYgNTJINDRDNDguNDE4MyA1MiA1MiA1NS41ODE3IDUyIDYwVjY4QzUyIDcyLjQxODMgNDguNDE4MyA3NiA0NCA3NkgzNkMzMS41ODE3IDc2IDI4IDcyLjQxODMgMjggNjhWNjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                  }}
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2 h-2 text-white fill-current" />
                </div>
              </div>
              
              {/* Recipe Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2 line-clamp-2">
                  {recipe.name}
                </h4>
                
                {/* Nutrition Info */}
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    {recipe.calories} cal
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    P: {recipe.protein}g
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    C: {recipe.carbs}g
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    F: {recipe.fats}g
                  </span>
                </div>
                
                {/* Recipe Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Quick meal
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    1 serving
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.calories)}`}>
                    {recipe.calories < 200 ? 'Light' : recipe.calories < 400 ? 'Moderate' : 'Hearty'}
                  </span>
                </div>
              </div>
              
              {/* View Recipe Button */}
              <div className="flex items-center">
                <a
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all duration-300 hover-scale text-sm font-medium"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        ))}
        
        {recipes.length === 0 && ingredients && !isSearching && (
          <div className="text-center p-8 bg-gray-50 dark:bg-[#262626] rounded-xl animate-fade-in-up">
            <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">No recipes found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Try different ingredients or check your spelling
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeFinder;
