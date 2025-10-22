import React, { useState } from 'react';
import { Plus, Search, X, TrendingUp, Clock, Star } from 'lucide-react';
import { searchFood } from '../utils/api';
import { searchFoodDatabase, getRandomFoodSuggestions } from '../utils/foodDatabase';
import FoodLogList from './FoodLogList';

const FoodTracker = ({ dailyLog, setDailyLog }) => {
  const [foodSearch, setFoodSearch] = useState('');
  const [foodAmount, setFoodAmount] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions] = useState(getRandomFoodSuggestions(6));
  const [liveResults, setLiveResults] = useState([]);

  const handleSearch = async () => {
    if (!foodSearch.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    
    try {
      // First try local database
      const localResults = searchFoodDatabase(foodSearch);
      if (localResults.length > 0) {
        setSearchResults(localResults);
      } else {
        // Fallback to API
        const apiResults = await searchFood(foodSearch);
        setSearchResults(apiResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const addFood = (food) => {
    const grams = parseFloat(foodAmount) || 100;
    const multiplier = grams / 100;
    
    const newFood = {
      id: Date.now() + Math.random(),
      name: `${food.name} (${grams}g)`,
      calories: Math.round(food.calories * multiplier),
      protein: Math.round(food.protein * multiplier),
      carbs: Math.round(food.carbs * multiplier),
      fats: Math.round(food.fats * multiplier),
      timestamp: new Date().toISOString()
    };
    
    setDailyLog(prev => ({
      calories: prev.calories + newFood.calories,
      protein: prev.protein + newFood.protein,
      carbs: prev.carbs + newFood.carbs,
      fats: prev.fats + newFood.fats,
      foods: [...prev.foods, newFood]
    }));
    
    setFoodSearch('');
    setFoodAmount('');
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const removeFood = (foodId) => {
    const foodToRemove = dailyLog.foods.find(f => f.id === foodId);
    if (!foodToRemove) return;

    setDailyLog(prev => ({
      calories: prev.calories - foodToRemove.calories,
      protein: prev.protein - foodToRemove.protein,
      carbs: prev.carbs - foodToRemove.carbs,
      fats: prev.fats - foodToRemove.fats,
      foods: prev.foods.filter(f => f.id !== foodId)
    }));
  };

  const handleSuggestionClick = (suggestion) => {
    setFoodSearch(suggestion.name);
    setFoodAmount('100');
    setShowSuggestions(false);
  };

  // Real-time search as user types
  const handleInputChange = (e) => {
    const value = e.target.value;
    setFoodSearch(value);
    
    if (value.trim().length >= 2) {
      // Search local database in real-time
      const results = searchFoodDatabase(value);
      setLiveResults(results.slice(0, 5)); // Show top 5 results
      setShowSuggestions(false);
    } else {
      setLiveResults([]);
      setShowSuggestions(value.length === 0);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-6 transition-all duration-300 border border-gray-100 dark:border-white/8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="relative">
            <Plus className="w-6 h-6 text-blue-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          Food Tracker
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/70">
          <Clock className="w-4 h-4" />
          <span>Today's Log</span>
        </div>
      </div>
      
      {/* Helpful Hint */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 animate-fade-in-up">
        <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
          <span className="text-blue-500 font-bold">💡</span>
          <span>
            <strong>Track what you eat!</strong> Search for foods you've consumed, set the amount in grams, and add them to compute your daily macros and achieve your nutrition goals.
          </span>
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          {/* Mobile Layout (< 640px) - Stacked */}
          <div className="sm:hidden space-y-3">
            {/* Search Input - Full Width */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search food..."
                value={foodSearch}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setShowSuggestions(foodSearch.length === 0)}
                className="w-full pl-11 pr-10 py-3.5 text-base border-2 border-gray-300 dark:border-white/8 rounded-xl bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white transition-all duration-300 focus-ring focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-600"
              />
              {foodSearch && (
                <button
                  onClick={() => {
                    setFoodSearch('');
                    setSearchResults([]);
                    setLiveResults([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Grams + Button Row */}
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Grams"
                value={foodAmount}
                onChange={(e) => setFoodAmount(e.target.value)}
                className="flex-1 px-4 py-3.5 text-base border-2 border-gray-300 dark:border-white/8 rounded-xl bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white transition-all duration-300 focus-ring focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-600"
              />
              
              <button
                onClick={handleSearch}
                disabled={isSearching || !foodSearch.trim()}
                className={`flex-1 px-4 py-3.5 rounded-xl font-medium text-white transition-all duration-300 focus-ring text-base ${
                  isSearching || !foodSearch.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSearching ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Adding...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    <span>Add Food</span>
                  </div>
                )}
              </button>
            </div>
          </div>
          
          {/* Desktop Layout (≥ 640px) - Horizontal */}
          <div className="hidden sm:flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search food..."
                value={foodSearch}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => setShowSuggestions(foodSearch.length === 0)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-white/8 rounded-xl bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white transition-all duration-300 focus-ring focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-600"
              />
              {foodSearch && (
                <button
                  onClick={() => {
                    setFoodSearch('');
                    setSearchResults([]);
                    setLiveResults([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="relative">
              <input
                type="number"
                placeholder="Grams"
                value={foodAmount}
                onChange={(e) => setFoodAmount(e.target.value)}
                className="w-24 px-3 py-3 border-2 border-gray-300 dark:border-white/8 rounded-xl bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white transition-all duration-300 focus-ring focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-600"
              />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={isSearching || !foodSearch.trim()}
              className={`px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 focus-ring hover-scale ${
                isSearching || !foodSearch.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Food</span>
                </div>
              )}
            </button>
          </div>
          
          {/* Live Search Results (as you type) */}
          {liveResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-10 animate-fade-in-scale">
              <div className="p-3 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <Search className="w-4 h-4 text-blue-500" />
                  <span>Found {liveResults.length} results</span>
                </div>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {liveResults.map((food, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setFoodSearch(food.name);
                      setFoodAmount('100');
                      setLiveResults([]);
                    }}
                    className="w-full p-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-b border-gray-100 dark:border-white/10 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{food.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {food.calories}cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                        </p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quick Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-10 animate-fade-in-scale">
              <div className="p-3 border-b border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Popular Foods</span>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:border-white/10 last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{suggestion.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {suggestion.calories}cal | P: {suggestion.protein}g | C: {suggestion.carbs}g | F: {suggestion.fats}g
                        </p>
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto animate-fade-in-up">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>Search Results ({searchResults.length})</span>
            </div>
            {searchResults.map((food, idx) => (
              <div
                key={idx}
                onClick={() => addFood(food)}
                className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl cursor-pointer hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 hover-scale border border-gray-200 dark:border-white/10"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {food.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(food.calories)}cal | P: {Math.round(food.protein)}g | C: {Math.round(food.carbs)}g | F: {Math.round(food.fats)}g
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Plus className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <FoodLogList foods={dailyLog.foods} onRemove={removeFood} />
    </div>
  );
};

export default FoodTracker;
