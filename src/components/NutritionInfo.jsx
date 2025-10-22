import React from 'react';
import { Target, TrendingUp, Droplets, Scale, Lightbulb, CheckCircle } from 'lucide-react';

const NutritionInfo = ({ nutrition, userData }) => {
  if (!nutrition.tdee) return null;

  const isMaintenance = userData?.goal === 'maintain';

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-6 transition-all duration-300 border border-gray-100 dark:border-white/8">

      {/* BMI and Basic Info */}
      <div className={`grid grid-cols-1 ${isMaintenance ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-4 mb-6`}>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-900 dark:text-white">BMI</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{nutrition.bmi}</div>
          <div className={`text-sm font-medium ${nutrition.bmiColor}`}>
            {nutrition.bmiCategory}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {nutrition.bmiRecommendation}
          </div>
        </div>

        {!isMaintenance && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Target Weight</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {nutrition.targetWeight ? `${nutrition.targetWeight}kg` : 'Not set'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              🎯 Your goal/milestone
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-gray-900 dark:text-white">Water Intake</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {nutrition.waterIntake}ml
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Daily recommendation
          </div>
        </div>
      </div>

      {/* Calorie and Macro Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">Daily Calories</h4>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {nutrition.calorieAdjustment}
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {nutrition.tdee} kcal
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            BMR: {nutrition.bmr} kcal | TDEE: {nutrition.tdee} kcal
          </div>
          {nutrition.currentWeightUsed && nutrition.referenceWeight && (
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>Using current weight ({nutrition.referenceWeight}kg) for calculations</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-gray-900 dark:text-white">Protein</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {nutrition.protein}g
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {nutrition.proteinGPerLb || '0.9'} g/lb • {nutrition.proteinPercent}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-900 dark:text-white">Carbs</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {nutrition.carbs}g
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {nutrition.carbsGPerLb || '1.75'} g/lb • {nutrition.carbsPercent}
            </div>
          </div>
        </div>
      </div>

      {/* Goal-Specific Recommendations */}
      {nutrition.goalRecommendations && (
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-indigo-500" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {nutrition.goalRecommendations.title} Tips
            </h4>
          </div>
          <div className="space-y-2">
            {nutrition.goalRecommendations.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Protein:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  {nutrition.goalRecommendations.protein}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Carbs:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  {nutrition.goalRecommendations.carbs}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-900 dark:text-white">Calories:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  {nutrition.goalRecommendations.calories}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionInfo;
