import React, { useState } from 'react';
import { User, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

const UserSetup = ({ userData, setUserData, onComplete }) => {
  const [currentField, setCurrentField] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateForm = () => {
    const basicValid = userData.name && userData.age && userData.height && userData.weight && 
                       userData.gender && userData.activityLevel && userData.goal;
    
    // If goal is not maintenance, target weight is required
    const needsTargetWeight = userData.goal !== 'maintain' && userData.goal !== '';
    const targetWeightValid = needsTargetWeight ? userData.targetWeight : true;
    
    const valid = basicValid && targetWeightValid;
    setIsValid(valid);
  };

  React.useEffect(() => {
    validateForm();
  }, [userData]);

  const handleInputChange = (field, value) => {
    setUserData({...userData, [field]: value});
    setCurrentField(field);
  };

  const handleComplete = () => {
    if (isValid) {
      onComplete();
    }
  };

  return (
    <div className="bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto border border-white/20 dark:border-white/8/50 animate-fade-in-scale">
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <User className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 gradient-text animate-fade-in-up">
          Let's Get Started
        </h2>
        <p className="text-gray-600 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Tell us about yourself to calculate your perfect nutrition plan
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Name Input */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your name"
              value={userData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onFocus={() => setCurrentField('name')}
              className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                currentField === 'name' ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
              }`}
            />
            {userData.name && (
              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 animate-fade-in-scale" />
            )}
          </div>
        </div>
        
        {/* Age and Gender */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age
            </label>
            <input
              type="number"
              placeholder=""
              value={userData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              onFocus={() => setCurrentField('age')}
              className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                currentField === 'age' ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
          <select
            value={userData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            onFocus={() => setCurrentField('gender')}
            className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
              currentField === 'gender' ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
            }`}
          >
            <option value="" disabled>Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          </div>
        </div>
        
        {/* Height and Weight */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              placeholder=""
              value={userData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
              onFocus={() => setCurrentField('height')}
              className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                currentField === 'height' ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              placeholder=""
              value={userData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              onFocus={() => setCurrentField('weight')}
              className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                currentField === 'weight' ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
              }`}
            />
          </div>
        </div>
        
        {/* Activity Level */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Activity Level
          </label>
          <select
            value={userData.activityLevel}
            onChange={(e) => handleInputChange('activityLevel', e.target.value)}
            onFocus={() => setCurrentField('activityLevel')}
            className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
              currentField === 'activityLevel' ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
            }`}
          >
            <option value="" disabled>Select your activity level</option>
            <option value="1.2">Sedentary (little/no exercise)</option>
            <option value="1.375">Light (1-3 days/week)</option>
            <option value="1.55">Moderate (3-5 days/week)</option>
            <option value="1.725">Active (6-7 days/week)</option>
            <option value="1.9">Very Active (athlete)</option>
          </select>
        </div>
        
        {/* Goal */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Goal
          </label>
          <select
            value={userData.goal}
            onChange={(e) => handleInputChange('goal', e.target.value)}
            onFocus={() => setCurrentField('goal')}
            className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
              currentField === 'goal' ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
            }`}
          >
            <option value="" disabled>Select your goal</option>
            <option value="maintain">Maintenance (Current Weight)</option>
            <option value="muscle">Bulking (Muscle Gain)</option>
            <option value="loss">Cutting (Fat Loss)</option>
            <option value="recomp">Recomp (Lose Fat + Gain Muscle)</option>
            <option value="slowloss">Losing Weight (Slow Fat Loss)</option>
          </select>
        </div>

        {/* Target Weight (conditional - only for non-maintenance goals) */}
        {userData.goal && userData.goal !== 'maintain' && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.75s' }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Weight (kg) 🎯
            </label>
            <input
              type="number"
              step="0.1"
              placeholder=""
              value={userData.targetWeight}
              onChange={(e) => handleInputChange('targetWeight', e.target.value)}
              onFocus={() => setCurrentField('targetWeight')}
              className={`w-full p-4 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                currentField === 'targetWeight' ? 'border-blue-500 shadow-lg' : 'border-gray-300 dark:border-white/10'
              }`}
            />
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              💡 This is your goal weight for {userData.goal === 'muscle' ? 'bulking' : userData.goal === 'loss' ? 'cutting' : userData.goal === 'slowloss' ? 'losing weight' : 'recomp'}
            </p>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={handleComplete}
            disabled={!isValid}
            className={`w-full group relative overflow-hidden py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 focus-ring ${
              isValid 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover-scale shadow-lg hover:shadow-xl' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Calculate My Goals</span>
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isValid ? 'group-hover:translate-x-1' : ''}`} />
            </div>
            {isValid && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSetup;
