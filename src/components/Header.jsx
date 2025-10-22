import React from 'react';
import { Moon, Sun, LogOut, User, Activity } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, user, onLogout, userName, greeting, onProfileClick }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
        {/* Single Container Card - extends down to hide content */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl py-3 sm:pt-4 sm:pb-8 px-3 sm:px-6 border border-gray-100 dark:border-white/5 shadow-lg mb-4 sm:mb-6">
          
          {/* MOBILE LAYOUT (< 640px) */}
          <div className="sm:hidden">
            {/* Compact Header Layout */}
            <div className="flex items-center justify-between gap-3">
              {/* Left: Logo + Title */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl flex-shrink-0">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight truncate">
                    MacroGenie
                  </h1>
                  <h2 className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                    {greeting}, {userName || 'there'}!
                  </h2>
                </div>
              </div>
              
              {/* Right: Action Buttons */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* My Stats */}
                <button
                  onClick={onProfileClick}
                  className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-200 flex items-center justify-center"
                  aria-label="My Stats"
                >
                  <User className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                </button>
                
                {/* Dark Mode */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="w-4.5 h-4.5 text-yellow-400" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
                
                {/* Logout */}
                {user && (
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 flex items-center justify-center"
                    aria-label="Logout"
                  >
                    <LogOut className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* DESKTOP LAYOUT (≥ 640px) */}
          <div className="hidden sm:flex sm:items-center sm:justify-between gap-4">
            {/* Logo + Title + Greeting */}
            <div className="flex items-start gap-4 min-w-0 flex-1">
              {/* Logo */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl flex-shrink-0">
                <Activity className="w-10 h-10 text-white" />
              </div>
              
              {/* Title + Greeting Stack */}
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight truncate">
                  MacroGenie
                </h1>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">
                  {greeting}, {userName || 'there'}!
                </h2>
              </div>
      </div>
            
            {/* Buttons Row */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* My Stats Button */}
              <button
                onClick={onProfileClick}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-lg transition-all duration-200 hover-lift text-base"
              >
                <User className="w-4 h-4" />
                <span>My Stats</span>
              </button>
              
              {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              
              {/* Logout Button */}
              {user && (
                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 flex items-center justify-center"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
      </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

