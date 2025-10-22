import React from 'react';
import { X, Clock, TrendingUp } from 'lucide-react';

const FoodLogList = ({ foods, onRemove }) => {
  if (!foods || foods.length === 0) {
    return (
      <div className="mt-6 p-6 text-center bg-gray-50 dark:bg-[#262626] rounded-xl animate-fade-in-up">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">No foods logged yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          Start by searching and adding foods above
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          Today's Foods ({foods.length})
        </h4>
      </div>
      
      <div className="max-h-60 overflow-y-auto space-y-2">
        {foods.map((food, idx) => (
          <div 
            key={food.id || idx} 
            className="group p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-white/10 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {food.name}
                </p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    {food.calories} cal
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    P: {food.protein}g
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    C: {food.carbs}g
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    F: {food.fats}g
                  </span>
                </div>
                {food.timestamp && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Added {new Date(food.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              {onRemove && (
                <button
                  onClick={() => onRemove(food.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 dark:hover:text-red-400"
                  aria-label="Remove food"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodLogList;
