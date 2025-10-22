import React, { useState } from 'react';
import { User, Lock, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

const PasswordReset = ({ onBack, onResetComplete }) => {
  const [step, setStep] = useState(1); // 1: Enter username, 2: Set new password
  const [formData, setFormData] = useState({
    username: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setErrors({ username: 'Username is required' });
      return;
    }

    // Check if username exists
    const usersData = localStorage.getItem('macroGenie_users');
    if (!usersData) {
      setErrors({ username: 'No account found with this username' });
      return;
    }

    const users = JSON.parse(usersData);
    const userExists = users.find(u => u.username.toLowerCase() === formData.username.toLowerCase());
    
    if (!userExists) {
      setErrors({ username: 'No account found with this username' });
      return;
    }

    // Move to step 2
    setStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Update password
      const usersData = localStorage.getItem('macroGenie_users');
      const users = JSON.parse(usersData);
      
      const userIndex = users.findIndex(u => u.username.toLowerCase() === formData.username.toLowerCase());
      
      if (userIndex !== -1) {
        const hashedPassword = await hashPassword(formData.newPassword);
        users[userIndex].passwordHash = hashedPassword;
        users[userIndex].lastPasswordChange = new Date().toISOString();
        
        localStorage.setItem('macroGenie_users', JSON.stringify(users));
        
        // Success!
        setTimeout(() => {
          onResetComplete();
        }, 1500);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-white/20 dark:border-white/8 animate-fade-in-scale">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Sign In</span>
      </button>

      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <Shield className="w-12 h-12 text-indigo-500 mx-auto" />
        </div>
        <h2 className="text-3xl font-bold mb-2 gradient-text">
          Reset Password
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {step === 1 ? 'Enter your username to continue' : 'Set your new password'}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleStep1Submit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                  errors.username ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
                }`}
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 focus-ring hover-scale"
          >
            Continue
          </button>
        </form>
      ) : (
        <form onSubmit={handleStep2Submit} className="space-y-6">
          {/* New Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Enter new password (min 8 characters)"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
                }`}
                autoComplete="new-password"
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
                }`}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 focus-ring hover-scale ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Resetting Password...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Reset Password</span>
              </div>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default PasswordReset;




