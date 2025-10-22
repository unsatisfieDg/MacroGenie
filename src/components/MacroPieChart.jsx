import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Target, Zap, TrendingUp, Award } from 'lucide-react';

const MacroPieChart = ({ dailyLog }) => {
  const pieData = [
    { 
      name: 'Protein', 
      value: dailyLog.protein || 0, 
      color: '#3b82f6',
      icon: Target,
      description: 'Muscle Building'
    },
    { 
      name: 'Carbs', 
      value: dailyLog.carbs || 0, 
      color: '#10b981',
      icon: TrendingUp,
      description: 'Energy Source'
    },
    { 
      name: 'Calories', 
      value: dailyLog.calories || 0, 
      color: '#f59e0b',
      icon: Zap,
      description: 'Daily Energy'
    }
  ];

  const totalMacros = pieData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalMacros > 0 ? ((data.value / totalMacros) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 animate-fade-in-scale">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: data.payload.color }}
            ></div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.name}
            </span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between gap-4">
              <span>{data.value}g</span>
              <span className="font-medium">{percentage}%</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {data.payload.description}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry, index) => {
          const Icon = pieData[index]?.icon || Target;
          const percentage = totalMacros > 0 ? ((entry.value / totalMacros) * 100).toFixed(1) : 0;
          
          return (
            <div key={entry.value} className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {entry.value}g ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-6 transition-all duration-300 border border-gray-100 dark:border-white/8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="relative">
            <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
          </div>
          Today's Macros
        </h3>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalMacros}g
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Macros
            </div>
          </div>
        </div>
      </div>

      <CustomLegend payload={pieData} />

      {/* Macro breakdown */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {pieData.map((item, index) => {
          const Icon = item.icon;
          const percentage = totalMacros > 0 ? ((item.value / totalMacros) * 100).toFixed(1) : 0;
          
          return (
            <div 
              key={item.name}
              className="text-center p-3 rounded-xl bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: item.color }} />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {item.value}g
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {percentage}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MacroPieChart;
