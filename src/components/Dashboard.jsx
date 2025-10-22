import React, { useEffect } from 'react';
import { User } from 'lucide-react';
import NutritionCards from './NutritionCards';
import MacroPieChart from './MacroPieChart';
import FoodTracker from './FoodTracker';
import RecipeFinder from './RecipeFinder';
import AIAssistant from './AIAssistant';
import NutritionInfo from './NutritionInfo';
import Footer from './Footer';

const Dashboard = ({ userData, nutrition, dailyLog, setDailyLog, onProfileClick, darkMode, setDarkMode, user, onLogout }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up px-3 sm:px-4 md:px-5 lg:px-6 pt-20">
      {/* Main Content Card */}
      <div className="health-card p-6 sm:p-8 mb-6">

        {/* Nutrition Plan Section */}
        <div className="mb-6">
          <NutritionInfo nutrition={nutrition} userData={userData} />
        </div>

        {/* Today's Progress Cards */}
        <div className="mb-6">
          <NutritionCards nutrition={nutrition} dailyLog={dailyLog} />
        </div>
      
        {/* Charts and Tracking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <MacroPieChart dailyLog={dailyLog} />
          </div>
          <div>
            <FoodTracker dailyLog={dailyLog} setDailyLog={setDailyLog} />
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <RecipeFinder />
          </div>
          <div>
            <AIAssistant userData={userData} nutrition={nutrition} dailyLog={dailyLog} />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
