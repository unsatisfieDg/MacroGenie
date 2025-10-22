import { useState, useEffect } from 'react';

// Simple password hashing using SHA-256
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Get all users from localStorage
const getAllUsers = () => {
  const usersData = localStorage.getItem('macroGenie_users');
  if (!usersData) return [];
  try {
    return JSON.parse(usersData);
  } catch (error) {
    console.error('Error parsing users:', error);
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem('macroGenie_users', JSON.stringify(users));
};

// User authentication and management
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('macroGenie_currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('macroGenie_currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const signup = async (username, password) => {
    const users = getAllUsers();
    
    // Check if username already exists
    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: username,
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Save to users list
    users.push(newUser);
    saveUsers(users);

    // Set as current user (without password hash)
    const userSession = {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin
    };
    
    setUser(userSession);
    localStorage.setItem('macroGenie_currentUser', JSON.stringify(userSession));
    
    return { success: true, user: userSession };
  };

  const login = async (username, password) => {
    const users = getAllUsers();
    
    // Find user by username (case-insensitive)
    const foundUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!foundUser) {
      return { success: false, error: 'Incorrect username or password' };
    }

    // Hash the provided password and compare
    const hashedPassword = await hashPassword(password);
    
    if (hashedPassword !== foundUser.passwordHash) {
      return { success: false, error: 'Incorrect username or password' };
    }

    // Update last login
    foundUser.lastLogin = new Date().toISOString();
    saveUsers(users);

    // Set as current user (without password hash)
    const userSession = {
      id: foundUser.id,
      username: foundUser.username,
      createdAt: foundUser.createdAt,
      lastLogin: foundUser.lastLogin
    };
    
    setUser(userSession);
    localStorage.setItem('macroGenie_currentUser', JSON.stringify(userSession));
    
    return { success: true, user: userSession };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('macroGenie_currentUser');
  };

  const updateUser = (updates) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    setUser(updatedUser);
    localStorage.setItem('macroGenie_currentUser', JSON.stringify(updatedUser));
  };

  return {
    user,
    isLoading,
    signup,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };
};

// User profile management
export const useUserProfile = (user) => {
  const [profile, setProfile] = useState({
    currentWeight: null,
    targetWeight: null,
    preferences: {
      units: 'metric', // metric, imperial
      notifications: true,
      darkMode: false
    }
  });

  useEffect(() => {
    if (user) {
      const profileKey = `macroGenie_profile_${user.id}`;
      const savedProfile = localStorage.getItem(profileKey);
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (error) {
          console.error('Error parsing saved profile:', error);
        }
      } else {
        // Reset to default if no profile for this user
        setProfile({
          currentWeight: null,
          targetWeight: null,
          preferences: {
            units: 'metric',
            notifications: true,
            darkMode: false
          }
        });
      }
    }
  }, [user]);

  const updateProfile = (updates) => {
    if (!user) return;
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    const profileKey = `macroGenie_profile_${user.id}`;
    localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
  };

  return {
    profile,
    updateProfile
  };
};

// Meal tracking and management
export const useMealTracking = () => {
  const [meals, setMeals] = useState({
    breakfast: { completed: false, time: null, foods: [] },
    lunch: { completed: false, time: null, foods: [] },
    dinner: { completed: false, time: null, foods: [] },
    snacks: { completed: false, time: null, foods: [] }
  });

  const [cheatMeal, setCheatMeal] = useState({
    used: false,
    date: null,
    foods: []
  });

  useEffect(() => {
    const savedMeals = localStorage.getItem('macroGenie_meals');
    const savedCheatMeal = localStorage.getItem('macroGenie_cheatMeal');
    
    if (savedMeals) {
      try {
        setMeals(JSON.parse(savedMeals));
      } catch (error) {
        console.error('Error parsing saved meals:', error);
      }
    }
    
    if (savedCheatMeal) {
      try {
        setCheatMeal(JSON.parse(savedCheatMeal));
      } catch (error) {
        console.error('Error parsing saved cheat meal:', error);
      }
    }
  }, []);

  const addFoodToMeal = (mealType, food) => {
    const updatedMeals = {
      ...meals,
      [mealType]: {
        ...meals[mealType],
        foods: [...meals[mealType].foods, food],
        time: meals[mealType].time || new Date().toISOString()
      }
    };
    setMeals(updatedMeals);
    localStorage.setItem('macroGenie_meals', JSON.stringify(updatedMeals));
  };

  const completeMeal = (mealType) => {
    const updatedMeals = {
      ...meals,
      [mealType]: {
        ...meals[mealType],
        completed: true,
        time: meals[mealType].time || new Date().toISOString()
      }
    };
    setMeals(updatedMeals);
    localStorage.setItem('macroGenie_meals', JSON.stringify(updatedMeals));
  };

  const addCheatMeal = (foods) => {
    const newCheatMeal = {
      used: true,
      date: new Date().toISOString(),
      foods: foods
    };
    setCheatMeal(newCheatMeal);
    localStorage.setItem('macroGenie_cheatMeal', JSON.stringify(newCheatMeal));
  };

  const addCustomMeal = (mealName, mealTime) => {
    const customMealKey = mealName.toLowerCase().replace(/\s+/g, '_');
    const updatedMeals = {
      ...meals,
      [customMealKey]: {
        completed: false,
        time: null,
        foods: [],
        customName: mealName,
        customTime: mealTime
      }
    };
    setMeals(updatedMeals);
    localStorage.setItem('macroGenie_meals', JSON.stringify(updatedMeals));
  };

  const removeCustomMeal = (mealType) => {
    const updatedMeals = { ...meals };
    delete updatedMeals[mealType];
    setMeals(updatedMeals);
    localStorage.setItem('macroGenie_meals', JSON.stringify(updatedMeals));
  };

  const resetDailyMeals = () => {
    const resetMeals = {
      breakfast: { completed: false, time: null, foods: [] },
      lunch: { completed: false, time: null, foods: [] },
      dinner: { completed: false, time: null, foods: [] },
      snacks: { completed: false, time: null, foods: [] }
    };
    setMeals(resetMeals);
    localStorage.setItem('macroGenie_meals', JSON.stringify(resetMeals));
  };

  const getTotalMealsCompleted = () => {
    return Object.values(meals).filter(meal => meal.completed).length;
  };

  const getAllMealsCompleted = () => {
    return Object.values(meals).every(meal => meal.completed);
  };

  return {
    meals,
    cheatMeal,
    addFoodToMeal,
    completeMeal,
    addCheatMeal,
    addCustomMeal,
    removeCustomMeal,
    resetDailyMeals,
    getTotalMealsCompleted,
    getAllMealsCompleted
  };
};

export default { useAuth, useUserProfile, useMealTracking };
