import React, { useState } from 'react';
import { User, Lock, ArrowRight, Sparkles, Shield } from 'lucide-react';
import PasswordReset from './PasswordReset';

const AuthForm = ({ onAuth, isLogin = true, onToggleMode }) => {
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (authError) {
      setAuthError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setAuthError('');
    
    try {
      const result = await onAuth(formData.username, formData.password, isLogin);
      
      if (!result.success) {
        setAuthError(result.error);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setFormData({ username: '', password: '', confirmPassword: '' });
    setErrors({});
    setAuthError('');
    onToggleMode();
  };

  // Show password reset form if requested
  if (showPasswordReset) {
    return (
      <PasswordReset
        onBack={() => setShowPasswordReset(false)}
        onResetComplete={() => {
          setShowPasswordReset(false);
          alert('Password reset successful! You can now sign in with your new password.');
        }}
      />
    );
  }

  return (
    <div className="bg-white/90 dark:bg-[#1f1f1f]/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md mx-auto border border-white/20 dark:border-white/8 animate-fade-in-scale">
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <User className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 gradient-text animate-fade-in-up">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {isLogin ? 'Sign in to continue your nutrition journey' : 'Join MacroGenie and start tracking your nutrition'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Auth Error Message */}
        {authError && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl p-4 animate-shake">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400 font-medium">{authError}</p>
            </div>
          </div>
        )}

        {/* Username Field */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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

        {/* Password Field */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white transition-all duration-300 focus-ring ${
                errors.password ? 'border-red-500' : 'border-gray-300 dark:border-white/10'
              }`}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowPasswordReset(true)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>

        {/* Confirm Password Field (Signup only) */}
        {!isLogin && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm your password"
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
        )}

        {/* Submit Button */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full group relative overflow-hidden py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 focus-ring hover-scale ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </div>
            {!isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            )}
          </button>
        </div>

        {/* Switch between Login/Signup */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={handleToggleMode}
              className="ml-2 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
