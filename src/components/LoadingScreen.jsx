import React, { useEffect } from 'react';
import { Activity } from 'lucide-react';

const LoadingScreen = ({ isLoading, onComplete }) => {
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  if (!isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:bg-[#0f0f0f]">
      <div className="text-center animate-fade-in-up">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl shadow-2xl animate-float mx-auto w-24 h-24 flex items-center justify-center">
            <Activity className="w-12 h-12 text-white animate-pulse" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
        </div>

        {/* App Name */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 animate-fade-in-up">
          MacroGenie
        </h1>
        
        {/* Tagline */}
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Smart Nutrition Assistant
        </p>

        {/* Loading Spinner */}
        <div className="flex justify-center gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
