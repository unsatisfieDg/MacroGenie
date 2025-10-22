import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UserSetup from './components/UserSetup';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import AuthForm from './components/AuthForm';
import UserProfile from './components/UserProfile';
import useLocalStorage from './hooks/useLocalStorage';
import useNutrition from './hooks/useNutrition';
import { useAuth, useUserProfile } from './hooks/useAuth';
import { useSessionManager } from './hooks/useSessionManager';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('macroGenie_darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('auth');
  const [showAuthForm, setShowAuthForm] = useState(true);
  const [isNewSignup, setIsNewSignup] = useState(false);

  // Authentication
  const { user, isLoading: authLoading, signup, login, logout, isAuthenticated } = useAuth();
  
  // Session management with auto-logout
  useSessionManager(user, logout);
  
  // User Profile
  const { profile, updateProfile } = useUserProfile(user);

  // User-specific state (not using useLocalStorage to avoid key conflicts)
  const [userData, setUserData] = useState({
    name: '', age: '', height: '', weight: '', gender: '',
    activityLevel: '', goal: '', targetWeight: ''
  });

  const [dailyLog, setDailyLog] = useState({
    calories: 0, protein: 0, carbs: 0, foods: []
  });

  const [weeklyData, setWeeklyData] = useState([]);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      console.log('Loading data for user:', user.id);
      
      const userDataKey = `macroGenie_userData_${user.id}`;
      const dailyLogKey = `macroGenie_dailyLog_${user.id}`;
      const weeklyDataKey = `macroGenie_weeklyData_${user.id}`;

      const savedUserData = localStorage.getItem(userDataKey);
      const savedDailyLog = localStorage.getItem(dailyLogKey);
      const savedWeeklyData = localStorage.getItem(weeklyDataKey);

      console.log('Saved user data for', user.id, ':', savedUserData);

      if (savedUserData) {
        try {
          const parsed = JSON.parse(savedUserData);
          console.log('Loaded existing data:', parsed);
          setUserData(parsed);
        } catch (e) {
          console.error('Error loading user data:', e);
          setUserData({
            name: '', age: '', height: '', weight: '', gender: '',
            activityLevel: '', goal: '', targetWeight: ''
          });
        }
      } else {
        console.log('No saved data found, using blank data');
        setUserData({
          name: '', age: '', height: '', weight: '', gender: '',
          activityLevel: '', goal: '', targetWeight: ''
        });
      }

      if (savedDailyLog) {
        try {
          setDailyLog(JSON.parse(savedDailyLog));
        } catch (e) {
          console.error('Error loading daily log:', e);
          setDailyLog({ calories: 0, protein: 0, carbs: 0, foods: [] });
        }
      } else {
        setDailyLog({ calories: 0, protein: 0, carbs: 0, foods: [] });
      }

      if (savedWeeklyData) {
        try {
          setWeeklyData(JSON.parse(savedWeeklyData));
        } catch (e) {
          console.error('Error loading weekly data:', e);
          setWeeklyData([]);
        }
      } else {
        setWeeklyData([]);
      }
    } else {
      // User logged out, reset everything
      console.log('User logged out, resetting data');
      setUserData({
        name: '', age: '', height: '', weight: '', gender: '',
        activityLevel: '', goal: '', targetWeight: ''
      });
      setDailyLog({ calories: 0, protein: 0, carbs: 0, foods: [] });
      setWeeklyData([]);
    }
  }, [user]);

  // Save user-specific data when it changes
  useEffect(() => {
    if (user && userData.name) {
      const userDataKey = `macroGenie_userData_${user.id}`;
      localStorage.setItem(userDataKey, JSON.stringify(userData));
    }
  }, [user, userData]);

  useEffect(() => {
    if (user) {
      const dailyLogKey = `macroGenie_dailyLog_${user.id}`;
      localStorage.setItem(dailyLogKey, JSON.stringify(dailyLog));
    }
  }, [user, dailyLog]);

  useEffect(() => {
    if (user) {
      const weeklyDataKey = `macroGenie_weeklyData_${user.id}`;
      localStorage.setItem(weeklyDataKey, JSON.stringify(weeklyData));
    }
  }, [user, weeklyData]);

  const { nutrition, calculateNutrition } = useNutrition(userData, profile);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('macroGenie_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Check if user needs to complete setup (only when user first logs in)
  useEffect(() => {
    if (isAuthenticated && user && currentStep === 'auth') {
      console.log('User authenticated:', user);
      console.log('Current step:', currentStep);
      console.log('User data:', userData);
      console.log('Is new signup:', isNewSignup);
      
      // For new signups, always go to setup
      if (isNewSignup) {
        console.log('New signup detected, redirecting to setup...');
        setCurrentStep('setup');
        return;
      }
      
      // For existing users, check localStorage directly (more reliable)
      const userDataKey = `macroGenie_userData_${user.id}`;
      const savedUserData = localStorage.getItem(userDataKey);
      
      if (savedUserData) {
        try {
          const parsed = JSON.parse(savedUserData);
          const hasCompletedSetup = parsed.name && parsed.age && parsed.height && parsed.weight;
          
          if (hasCompletedSetup) {
            console.log('Existing user with data, redirecting to dashboard...');
            setCurrentStep('dashboard');
            // Give time for userData to load before calculating
            setTimeout(() => calculateNutrition(), 100);
          } else {
            console.log('Existing user without data, redirecting to setup...');
            setCurrentStep('setup');
          }
        } catch (e) {
          console.error('Error parsing saved data:', e);
          setCurrentStep('setup');
        }
      } else {
        console.log('No saved data found, redirecting to setup...');
        setCurrentStep('setup');
      }
    }
  }, [isAuthenticated, user, currentStep, isNewSignup]);

  // Recalculate nutrition when profile changes (current weight, target weight, goal)
  useEffect(() => {
    if ((currentStep === 'dashboard' || currentStep === 'profile') && userData.weight) {
      calculateNutrition();
    }
  }, [profile.currentWeight, profile.targetWeight, userData.goal, userData.weight]);

  // Force recalculation when returning to dashboard
  useEffect(() => {
    if (currentStep === 'dashboard') {
      calculateNutrition();
    }
  }, [currentStep]);

  const handleAuth = async (username, password, isLoginMode) => {
    let result;
    if (isLoginMode) {
      result = await login(username, password);
      setIsNewSignup(false); // Existing user logging in
    } else {
      result = await signup(username, password);
      setIsNewSignup(true); // New user signing up
    }
    
    if (result.success) {
      setShowAuthForm(false);
      console.log('Auth successful, isNewSignup:', !isLoginMode);
    }
    
    return result;
  };

  const handleSetupComplete = () => {
    // Save current weight and target weight to profile
    if (userData.weight) {
      updateProfile({ currentWeight: parseFloat(userData.weight) });
    }
    if (userData.targetWeight) {
      updateProfile({ targetWeight: parseFloat(userData.targetWeight) });
    }
    
    calculateNutrition();
    setCurrentStep('dashboard');
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentStep('auth');
    setShowAuthForm(true);
  };

  const handleWeightChange = (newWeight) => {
    // Update userData with new current weight
    setUserData(prev => ({
      ...prev,
      weight: newWeight
    }));
    
    // Force immediate recalculation after a brief delay to ensure state is updated
    setTimeout(() => {
      calculateNutrition();
    }, 100);
  };

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} onComplete={handleLoadingComplete} />;
  }

  return (
    <div className={`min-h-screen transition-all duration-500 overflow-x-hidden ${
      darkMode && currentStep === 'dashboard'
        ? 'dark bg-[#0f0f0f]' 
        : 'bg-gradient-to-br from-slate-300 via-slate-200 to-slate-300'
    }`}>
        
      {currentStep === 'dashboard' && (
        <div className="py-6">
          <Header 
            darkMode={darkMode} 
            setDarkMode={setDarkMode} 
            user={user}
            onLogout={handleLogout}
            userName={userData.name}
            greeting={(() => {
              const hour = new Date().getHours();
              if (hour < 12) return 'Good morning';
              if (hour < 18) return 'Good afternoon';
              return 'Good evening';
            })()}
            onProfileClick={() => setCurrentStep('profile')}
          />
          <Dashboard
            userData={userData}
            nutrition={nutrition}
            dailyLog={dailyLog}
            setDailyLog={setDailyLog}
            weeklyData={weeklyData}
            onProfileClick={() => setCurrentStep('profile')}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      )}

      {currentStep !== 'dashboard' && (
        // Other pages with normal container
        <div className="relative z-10 max-w-7xl mx-auto container-responsive py-6">
          {/* Header only shows on dashboard, not on auth/setup/profile */}

          {currentStep === 'auth' && (
            <div className="flex justify-center items-center min-h-[85vh] py-8">
              <AuthForm 
                onAuth={handleAuth} 
                isLogin={showAuthForm}
                onToggleMode={() => setShowAuthForm(!showAuthForm)}
              />
            </div>
          )}
          
          {currentStep === 'setup' && (
            <div className="py-4">
            <UserSetup 
              userData={userData}
              setUserData={setUserData}
              onComplete={handleSetupComplete}
            />
            </div>
          )}

          {currentStep === 'profile' && (
            <div className="py-4">
              <UserProfile
                user={user}
                profile={profile}
                userData={userData}
                setUserData={setUserData}
                updateProfile={updateProfile}
                onWeightChange={handleWeightChange}
                onBack={() => setCurrentStep('dashboard')}
              />
            </div>
        )}
      </div>
      )}
    </div>
  );
}

export default App;