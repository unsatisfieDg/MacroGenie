import React from 'react';
import { Zap, Target, TrendingUp } from 'lucide-react';

const NutritionCards = ({ nutrition, dailyLog }) => {
  const progressData = [
    { 
      name: 'Calories', 
      current: dailyLog.calories || 0, 
      target: nutrition.tdee || 0, 
      color: '#8b5cf6', 
      lightColor: '#c4b5fd',
      icon: Zap,
      unit: 'kcal',
      description: 'Daily Energy'
    },
    { 
      name: 'Protein', 
      current: dailyLog.protein || 0, 
      target: nutrition.protein || 0, 
      color: '#3b82f6', 
      lightColor: '#93c5fd',
      icon: Target,
      unit: 'g',
      description: 'Muscle Building'
    },
    { 
      name: 'Carbs', 
      current: dailyLog.carbs || 0, 
      target: nutrition.carbs || 0, 
      color: '#10b981', 
      lightColor: '#6ee7b7',
      icon: TrendingUp,
      unit: 'g',
      description: 'Energy Source'
    }
  ];

  const getPercentage = (current, target) => {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStatusBg = (percentage) => {
    if (percentage >= 100) return 'bg-green-50 dark:bg-green-900/20';
    if (percentage >= 75) return 'bg-blue-50 dark:bg-blue-900/20';
    if (percentage >= 50) return 'bg-yellow-50 dark:bg-yellow-900/20';
    return 'bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {progressData.map((item, index) => {
        const percentage = getPercentage(item.current, item.target);
        const statusColor = getStatusColor(percentage);
        const statusBg = getStatusBg(percentage);
        const Icon = item.icon;
        const remaining = Math.max(0, item.target - item.current);

        return (
          <div
            key={item.name}
            className="group bg-white dark:bg-[#1f1f1f] rounded-2xl p-6 transition-all duration-300 hover-lift border border-gray-100 dark:border-white/8"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className={`p-2.5 rounded-xl ${statusBg} transition-all duration-300 group-hover:scale-110`}
                >
                  <Icon className={`w-5 h-5 ${statusColor}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusBg} ${statusColor}`}>
                {percentage}%
              </div>
            </div>

            {/* Values */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {item.current.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / {item.target.toLocaleString()} {item.unit}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {percentage >= 100 ? (
                  <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Goal achieved!
                  </span>
                ) : (
                  `${remaining.toLocaleString()} ${item.unit} remaining`
                )}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2.5 bg-gray-200 dark:bg-[#1f1f1f] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out relative"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
              
              {/* Progress Indicator Dot */}
              <div
                className="absolute -top-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#1a1a1a] shadow-lg transition-all duration-500"
                style={{
                  left: `${percentage}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: item.color
                }}
              ></div>
            </div>

            {/* Status Text */}
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className={`font-medium ${statusColor}`}>
                {percentage >= 100 ? 'Complete' : percentage >= 75 ? 'Almost there' : percentage >= 50 ? 'Halfway' : 'Getting started'}
              </span>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {item.name}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NutritionCards;
