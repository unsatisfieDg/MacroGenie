import React, { useState, useEffect } from 'react';
import { User, Target, ArrowLeft, Save, Edit3, Mail, Calendar, TrendingUp, CheckCircle } from 'lucide-react';

const UserProfile = ({ user, profile, updateProfile, onWeightChange, onBack, userData, setUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentWeight, setCurrentWeight] = useState(profile.currentWeight || '');
  const [targetWeight, setTargetWeight] = useState(profile.targetWeight || '');
  const [isChangingGoal, setIsChangingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(userData?.goal || 'maintain');
  const [tempTargetWeight, setTempTargetWeight] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Sync with profile changes
  useEffect(() => {
    setCurrentWeight(profile.currentWeight || '');
    setTargetWeight(profile.targetWeight || '');
  }, [profile.currentWeight, profile.targetWeight]);
  
  // Sync goal changes
  useEffect(() => {
    setNewGoal(userData?.goal || 'maintain');
  }, [userData?.goal]);
  
  // Check if user's goal is maintenance
  const isMaintenance = userData?.goal === 'maintain';

  const handleSave = () => {
    const parsedCurrentWeight = parseFloat(currentWeight);
    const parsedTargetWeight = parseFloat(targetWeight);
    
    const updates = {
      currentWeight: parsedCurrentWeight,
      targetWeight: parsedTargetWeight
    };
    
    // Update profile first
    updateProfile(updates);
    
    // Then trigger weight change callback to update userData.weight and recalculate
    if (onWeightChange && !isNaN(parsedCurrentWeight)) {
      onWeightChange(parsedCurrentWeight);
    }
    
    setIsEditing(false);
  };

  const handleGoalChange = () => {
    const changingToMaintenance = newGoal === 'maintain';
    const changingFromMaintenance = userData?.goal === 'maintain' && newGoal !== 'maintain';
    
    // If changing from maintenance to another goal, require target weight
    if (changingFromMaintenance && !tempTargetWeight) {
      alert('Please enter your target weight for this goal');
      return;
    }
    
    // Update goal
    setUserData(prev => ({ ...prev, goal: newGoal }));
    
    // Update target weight if needed
    if (changingFromMaintenance && tempTargetWeight) {
      updateProfile({ targetWeight: parseFloat(tempTargetWeight) });
    }
    
    // If changing to maintenance, clear target weight
    if (changingToMaintenance) {
      updateProfile({ targetWeight: null });
    }
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
    
    // Close the goal change modal
    setIsChangingGoal(false);
    setTempTargetWeight('');
  };

  const getGoalLabel = (goal) => {
    const labels = {
      maintain: '⚙️ Maintenance (Current Weight)',
      muscle: '💪 Bulking (Muscle Gain)',
      loss: '🔥 Cutting (Fat Loss)',
      recomp: '⚖️ Recomp (Lose Fat + Gain Muscle)',
      slowloss: '🏃 Losing Weight (Slow Fat Loss)'
    };
    return labels[goal] || goal;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Profile Header */}
      <div className="bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 dark:border-white/8/50 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">@{user.username}</h1>
              <p className="text-gray-600 dark:text-gray-400">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 rounded-lg bg-gray-100 dark:bg-[#262626] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isEditing ? <Save className="w-5 h-5 text-green-500" onClick={handleSave} /> : <Edit3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
          </button>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-[#262626] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Username</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">@{user.username}</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#262626] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Member Since</span>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Weight Settings */}
      <div className="bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 dark:border-white/8/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-green-500" />
          Weight Settings
        </h2>

        {isMaintenance ? (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              ℹ️ You're on <strong>Maintenance</strong> mode - only current weight is needed
            </p>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <p className="text-sm text-green-700 dark:text-green-300">
              🎯 <strong>Current weight</strong> is used for calculations. <strong>Target weight</strong> is your goal milestone. Update current weight every 5 lbs!
            </p>
          </div>
        )}

        <div className={`grid grid-cols-1 ${!isMaintenance ? 'md:grid-cols-2' : ''} gap-6`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              disabled={!isEditing}
              className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 ${
                isEditing ? 'border-blue-500 focus-ring' : 'border-gray-300 dark:border-white/10'
              }`}
              placeholder="Enter your current weight"
            />
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              🧮 Used for ALL calculations
            </p>
          </div>

          {!isMaintenance && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                disabled={!isEditing}
                className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 ${
                  isEditing ? 'border-blue-500 focus-ring' : 'border-gray-300 dark:border-white/10'
                }`}
                placeholder="Enter your target weight"
              />
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                🎯 Your goal/milestone (not used for math)
              </p>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 hover-scale shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Goal Change Section */}
      <div className="bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 dark:border-white/8/50 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-500" />
          Your Current Goal
        </h2>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl animate-fade-in-scale">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700 dark:text-green-400 font-medium">
                Goal updated successfully! Your macros have been recalculated.
              </p>
            </div>
          </div>
        )}

        {/* Current Goal Display */}
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Goal</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getGoalLabel(userData?.goal)}
              </h3>
            </div>
            <button
              onClick={() => setIsChangingGoal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-medium transition-all duration-300 hover-scale shadow-lg hover:shadow-xl"
            >
              Change Goal
            </button>
          </div>
        </div>

        {/* Goal Change Modal */}
        {isChangingGoal && (
          <div className="p-6 bg-gray-50 dark:bg-[#262626] rounded-xl border-2 border-purple-500 animate-fade-in-scale">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Select Your New Goal
            </h3>
            
            <select
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              className="w-full p-4 border-2 border-purple-500 rounded-xl bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white mb-4 focus-ring"
            >
              <option value="maintain">⚙️ Maintenance (Current Weight)</option>
              <option value="muscle">💪 Bulking (Muscle Gain)</option>
              <option value="loss">🔥 Cutting (Fat Loss)</option>
              <option value="recomp">⚖️ Recomp (Lose Fat + Gain Muscle)</option>
              <option value="slowloss">🏃 Losing Weight (Slow Fat Loss)</option>
            </select>

            {/* Target Weight Input (if changing from maintenance) */}
            {userData?.goal === 'maintain' && newGoal !== 'maintain' && (
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's your target weight? (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tempTargetWeight}
                  onChange={(e) => setTempTargetWeight(e.target.value)}
                  placeholder="Enter target weight"
                  className="w-full p-3 border-2 border-yellow-500 rounded-xl bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-white focus-ring"
                />
                <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2">
                  💡 This will be used to calculate your new macros for {getGoalLabel(newGoal)}
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>What happens when you change goals:</strong><br />
                • Your calories, protein, and carbs will be recalculated<br />
                • Current weight is always used for calculations<br />
                • Update your current weight every 5 lbs of progress
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGoalChange}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 hover-scale shadow-lg"
              >
                Confirm Change
              </button>
              <button
                onClick={() => {
                  setIsChangingGoal(false);
                  setNewGoal(userData?.goal || 'maintain');
                  setTempTargetWeight('');
                }}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
