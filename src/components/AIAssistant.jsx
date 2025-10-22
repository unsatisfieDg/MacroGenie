import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Sparkles, TrendingUp, Flame, Target } from 'lucide-react';
import { getSmartResponse as getEnhancedResponse } from '../utils/smartResponses';

const AIAssistant = ({ userData = {}, nutrition = {}, dailyLog = {} }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useGeminiAI, setUseGeminiAI] = useState(false); // Using Enhanced AI (Gemini API has endpoint issues)
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  };

  useEffect(() => {
    // Only scroll if the chat container has messages
    if (chatMessages.length > 0) {
      scrollToBottom();
    }
  }, [chatMessages]);

  // Check if Gemini is configured on mount
  useEffect(() => {
    // Always use smart assistant system
    setUseGeminiAI(false);
    console.log('✅ Smart Nutrition Assistant is ready!');
  }, []);

  const getSmartResponse = (input, remaining, userData, nutrition, dailyLog) => {
    const lowerInput = input.toLowerCase();
    const userName = userData.name ? userData.name.split(' ')[0] : 'there';
    const goal = userData.goal || 'maintain';
    
    // Calculate percentages
    const caloriesPercent = Math.round(((dailyLog.calories || 0) / (nutrition.tdee || 1)) * 100);
    const proteinPercent = Math.round(((dailyLog.protein || 0) / (nutrition.protein || 1)) * 100);
    const carbsPercent = Math.round(((dailyLog.carbs || 0) / (nutrition.carbs || 1)) * 100);

    // Greeting responses
    if (lowerInput.match(/^(hi|hello|hey|sup|what's up|good morning|good afternoon|good evening)/)) {
      const timeOfDay = new Date().getHours();
      const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';
      return `${greeting}, ${userName}! 👋✨\n\nI'm your AI nutrition coach, here to help you crush your ${goal === 'muscle' ? 'bulking 💪' : goal === 'loss' ? 'cutting 🔥' : goal === 'slowloss' ? 'weight loss 🏃' : goal === 'recomp' ? 'recomp ⚖️' : 'maintenance 🎯'} goals!\n\nYou've consumed ${dailyLog.calories || 0}/${nutrition.tdee || 0} calories today (${caloriesPercent}%).\n\nHow can I assist you? 😊`;
    }

    // Progress and status
    if (lowerInput.includes('progress') || lowerInput.includes('status') || lowerInput.includes('how am i doing') || lowerInput.includes('how\'s my day')) {
      const performanceMessage = caloriesPercent >= 90 && caloriesPercent <= 110 
        ? '🎯 Perfect! You\'re right on track!'
        : caloriesPercent < 50
        ? '⚠️ You\'re falling behind - let\'s add some meals!'
        : caloriesPercent > 120
        ? '⚠️ You\'re over your goal - consider lighter options.'
        : '📈 Good progress! Keep it up!';

      return `📊 **Today's Detailed Progress:**\n\n🎯 **Overall Status:** ${caloriesPercent}% complete\n${performanceMessage}\n\n**Macros Breakdown:**\n🔥 Calories: ${dailyLog.calories || 0}/${nutrition.tdee || 0} (${caloriesPercent}%)\n💪 Protein: ${dailyLog.protein || 0}g/${nutrition.protein || 0}g (${proteinPercent}%)\n🌾 Carbs: ${dailyLog.carbs || 0}g/${nutrition.carbs || 0}g (${carbsPercent}%)\n\n**Remaining:**\n• ${Math.max(0, remaining.calories)} calories\n• ${Math.max(0, remaining.protein)}g protein\n• ${Math.max(0, remaining.carbs)}g carbs\n\n${caloriesPercent >= 100 ? '🎉 Goal achieved! Well done!' : '💪 Keep pushing forward!'}`;
    }

    // Meal suggestions
    if (lowerInput.includes('suggest') || lowerInput.includes('meal') || lowerInput.includes('what should i eat') || lowerInput.includes('food idea')) {
      const timeOfDay = new Date().getHours();
      const mealTime = timeOfDay < 11 ? 'breakfast' : timeOfDay < 16 ? 'lunch' : 'dinner';
      
      if (remaining.protein > 40) {
        return `🍗 **High-Protein ${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)} Suggestions:**\n\nYou need ${remaining.protein}g more protein today!\n\n**Best options:**\n• 🐔 Grilled chicken breast (200g) - 62g protein\n• 🐟 Salmon fillet (150g) - 38g protein  \n• 🥩 Lean beef steak (150g) - 45g protein\n• 🍳 Egg white omelet (6 eggs) - 35g protein\n• 🥛 Greek yogurt bowl (300g) - 30g protein\n\n**Quick tip:** Pair with veggies for balanced nutrition! 🥦\n\nCalories left: ${remaining.calories} kcal`;
      } else if (remaining.carbs > 60) {
        return `🍚 **Carb-Rich ${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)} Ideas:**\n\nYou need ${remaining.carbs}g more carbs for energy!\n\n**Smart choices:**\n• 🍠 Sweet potato (200g) - 40g carbs\n• 🍚 Brown rice (150g cooked) - 45g carbs\n• 🍝 Whole wheat pasta (100g dry) - 70g carbs\n• 🥖 Whole grain bread (2 slices) - 30g carbs\n• 🍌 Banana smoothie bowl - 50g carbs\n\n**Pro tip:** Complex carbs = sustained energy! ⚡\n\nCalories remaining: ${remaining.calories} kcal`;
      } else if (remaining.calories > 300) {
        return `🍽️ **Balanced ${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)} Suggestions:**\n\nYou have ${remaining.calories} calories left!\n\n**Complete meals:**\n• 🥗 Chicken Caesar salad (400 cal)\n• 🍲 Salmon with quinoa & veggies (450 cal)\n• 🌯 Turkey avocado wrap (380 cal)\n• 🍛 Beef stir-fry with rice (420 cal)\n• 🥙 Greek chicken bowl (390 cal)\n\n**Your remaining macros:**\n• Protein: ${remaining.protein}g\n• Carbs: ${remaining.carbs}g\n\nChoose one that fits your needs! 😊`;
      } else if (remaining.calories > 0 && remaining.calories <= 300) {
        return `🍎 **Light Snack Suggestions:**\n\nOnly ${remaining.calories} calories left - perfect for a snack!\n\n**Healthy options:**\n• 🥜 Handful of almonds (160 cal)\n• 🍌 Banana with peanut butter (200 cal)\n• 🥛 Protein shake (150-200 cal)\n• 🍎 Apple with Greek yogurt (180 cal)\n• 🥚 2 boiled eggs (140 cal)\n\n**Macros needed:**\n• Protein: ${remaining.protein}g\n• Carbs: ${remaining.carbs}g\n\nPick what fits best! 👌`;
      } else {
        return `🎉 **Great job, ${userName}!**\n\nYou've hit your calorie goal for today! ${caloriesPercent >= 100 ? '💯' : ''}\n\n✅ Calories: ${dailyLog.calories}/${nutrition.tdee}\n✅ Protein: ${dailyLog.protein}g/${nutrition.protein}g\n✅ Carbs: ${dailyLog.carbs}g/${nutrition.carbs}g\n\n${caloriesPercent > 110 ? '⚠️ You\'re slightly over - that\'s okay! Just be mindful for tomorrow.' : '🌟 Perfect balance! Keep this up!'}\n\nStay hydrated and rest well! 💪✨`;
      }
    }

    // Workout and exercise
    if (lowerInput.includes('workout') || lowerInput.includes('exercise') || lowerInput.includes('gym') || lowerInput.includes('training')) {
      return `💪 **Workout Nutrition Tips:**\n\n**Pre-Workout (30-60 min before):**\n🍌 Banana + peanut butter\n🍞 Toast with honey\n🥤 Protein smoothie\n\n**Post-Workout (within 2 hours):**\n🍗 Chicken + rice\n🥛 Protein shake + fruit\n🥚 Eggs + oatmeal\n\n**Your current protein:** ${dailyLog.protein}g/${nutrition.protein}g\n${remaining.protein > 30 ? `\n⚠️ Don't forget your post-workout protein! You need ${remaining.protein}g more.` : '\n✅ Protein on track!'}\n\n💡 Tip: ${goal === 'muscle' ? 'Consume protein within 2 hours post-workout for muscle growth!' : 'Stay hydrated and fuel properly for best results!'}`;
    }

    // Weight and goals
    if (lowerInput.includes('weight') || lowerInput.includes('goal') || lowerInput.includes('target')) {
      const goalMessages = {
        muscle: '💪 **Bulking Goal:**\nYou\'re building muscle! Focus on:\n• Calorie surplus\n• High protein intake (0.9g/lb)\n• Progressive overload in gym\n• Adequate rest',
        loss: '🔥 **Cutting Goal:**\nYou\'re losing fat! Remember:\n• Calorie deficit\n• High protein (1.1g/lb) to preserve muscle\n• Strength training\n• Patience is key!',
        slowloss: '🏃 **Slow Fat Loss Goal:**\nHealthy & sustainable! Focus on:\n• Moderate deficit\n• High protein (1.1g/lb)\n• Consistent training\n• Long-term habits',
        recomp: '⚖️ **Recomp Goal:**\nLose fat + gain muscle! Keys:\n• Slight deficit or maintenance\n• Very high protein (1.05g/lb)\n• Heavy lifting\n• Be patient - it takes time!',
        maintain: '🎯 **Maintenance Goal:**\nStay consistent with:\n• Balanced calories\n• Moderate protein (0.9g/lb)\n• Regular activity\n• Sustainable habits'
      };
      
      return `${goalMessages[goal] || goalMessages.maintain}\n\n**Your daily targets:**\n• 🔥 Calories: ${nutrition.tdee || 0} kcal\n• 💪 Protein: ${nutrition.protein || 0}g\n• 🌾 Carbs: ${nutrition.carbs || 0}g\n\n**Current progress:** ${caloriesPercent}%\n\nKeep crushing it! 💯`;
    }

    // Tips and advice
    if (lowerInput.includes('tip') || lowerInput.includes('advice') || lowerInput.includes('help')) {
      const tips = [
        '💧 **Hydration:** Drink at least 2-3L water daily for optimal performance!',
        '😴 **Sleep:** Aim for 7-9 hours - muscle recovery happens during sleep!',
        '🥗 **Veggies:** Include vegetables in every meal for micronutrients!',
        '📏 **Portions:** Use your hand as a guide - palm for protein, fist for carbs!',
        '🍽️ **Frequency:** Eat every 3-4 hours to keep metabolism active!',
        '📱 **Track:** Log everything you eat for the first few weeks to build awareness!'
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      return `✨ **Daily Nutrition Tips:**\n\n${randomTip}\n\n**Based on your ${goal} goal:**\n${goal === 'muscle' ? '• Eat in a slight surplus (+300-500 cal)\n• Prioritize protein at every meal\n• Don\'t fear carbs - they fuel growth!' : goal === 'loss' || goal === 'slowloss' ? '• Create a moderate deficit (-300-500 cal)\n• Keep protein HIGH to preserve muscle\n• Include strength training!' : '• Stay consistent with your macros\n• Focus on whole foods\n• Build sustainable habits!'}\n\n💪 You've got this, ${userName}!`;
    }

    // Recipe and cooking
    if (lowerInput.includes('recipe') || lowerInput.includes('cook') || lowerInput.includes('meal prep')) {
      return `👨‍🍳 **Recipe & Meal Prep Ideas:**\n\n**Based on your remaining macros:**\n• Calories: ${remaining.calories} kcal\n• Protein: ${remaining.protein}g\n• Carbs: ${remaining.carbs}g\n\n${remaining.protein > 40 ? '**High-Protein Recipes:**\n🍗 Grilled chicken with veggies\n🐟 Baked salmon with asparagus\n🥩 Lean beef stir-fry\n🍳 Egg white frittata' : remaining.carbs > 50 ? '**Carb-Rich Options:**\n🍚 Chicken fried rice\n🍝 Whole wheat pasta with turkey\n🍠 Sweet potato bowl with chicken\n🥗 Quinoa power bowl' : '**Balanced Meals:**\n🥗 Mixed protein salad\n🌯 Turkey avocado wrap\n🍲 Chicken veggie soup\n🥙 Greek chicken pita'}\n\n💡 **Pro tip:** Use the Recipe Finder above to discover meals with ingredients you have! 🔍`;
    }

    // Motivation
    if (lowerInput.includes('motivate') || lowerInput.includes('motivation') || lowerInput.includes('inspire')) {
      const motivational = [
        `🔥 **"Success is the sum of small efforts repeated day in and day out!"**\n\nYou're ${caloriesPercent}% of the way through today's goals. Every meal counts! 💪`,
        `⭐ **"Your body can stand almost anything. It's your mind you have to convince!"**\n\nYou've already logged ${dailyLog.calories || 0} calories today - you're building discipline! 🎯`,
        `💫 **"Progress, not perfection!"**\n\nDon't stress if you're not 100% perfect. You're ${caloriesPercent}% there and that's amazing! 🌟`,
        `🚀 **"The only bad workout is the one that didn't happen!"**\n\nSame with nutrition - every healthy meal is a win! Keep going! 💪`,
        `🏆 **"You didn't come this far to only come this far!"**\n\nYour ${goal} journey is worth it. Stay consistent! ✨`
      ];
      return motivational[Math.floor(Math.random() * motivational.length)];
    }

    // Default smart response
    return `Hey ${userName}! 👋\n\nI'm your AI nutrition assistant powered by smart algorithms! 🤖✨\n\n**I can help you with:**\n\n📊 **Progress Tracking:**\n"How am I doing?" or "Show my progress"\n\n🍽️ **Meal Suggestions:**\n"What should I eat?" or "Suggest a meal"\n\n💪 **Nutrition Advice:**\n"Workout tips" or "Give me advice"\n\n🎯 **Goal Support:**\n"My weight goal" or "Tips for ${goal}"\n\n🔍 **Recipes:**\n"Recipe ideas" or "Meal prep"\n\n**Quick stats:**\n• ${caloriesPercent}% of daily calories consumed\n• ${remaining.calories} kcal remaining\n• ${remaining.protein}g protein left\n\nWhat would you like to know? 😊`;
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: chatInput,
      timestamp: new Date().toISOString()
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const userInput = chatInput.trim();
    setChatInput('');

    try {
      const remaining = {
        calories: Math.max(0, (nutrition.tdee || 0) - (dailyLog.calories || 0)),
        protein: Math.max(0, (nutrition.protein || 0) - (dailyLog.protein || 0)),
        carbs: Math.max(0, (nutrition.carbs || 0) - (dailyLog.carbs || 0)),
      };

      // Use Smart Nutrition Assistant (enhanced intelligence)
      console.log('🧠 Smart Assistant processing...');
      const response = getEnhancedResponse(userInput, remaining, userData, nutrition, dailyLog);

      // Simulate a slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      setChatMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: response,
        timestamp: new Date().toISOString()
      }]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error getting response:', error);
      setChatMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, I encountered an error. Please try again!',
        timestamp: new Date().toISOString()
      }]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-6 transition-all duration-300 border border-gray-100 dark:border-white/8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-green-500 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          Smart Nutrition Assistant
      </h3>
        <div className="text-sm text-gray-500 dark:text-white/70">
          Intelligent Advisor
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-4 max-h-80 overflow-y-auto mb-4 scroll-smooth">
        {chatMessages.length === 0 && (
          <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl animate-fade-in-up border-2 border-green-200 dark:border-green-700">
            <Bot className="w-12 h-12 text-green-500 mx-auto mb-3 animate-bounce" />
            <p className="text-gray-900 dark:text-white font-bold text-lg mb-2">Hi {userData.name ? userData.name.split(' ')[0] : 'there'}! 👋</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
              I'm your smart nutrition assistant with advanced intelligence!
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              <span className="px-3 py-1 bg-green-500 text-white rounded-full">Smart</span>
              <span className="px-3 py-1 bg-blue-500 text-white rounded-full">Contextual</span>
              <span className="px-3 py-1 bg-purple-500 text-white rounded-full">Helpful</span>
            </div>
          </div>
        )}
        
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 animate-fade-in-up ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
              msg.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-[#262626] text-gray-900 dark:text-white'
            }`}
          >
              <div className="whitespace-pre-line text-sm leading-relaxed">
            {msg.content}
              </div>
              <div className={`text-xs mt-2 ${
                msg.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
            
            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start animate-fade-in-up">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-[#262626] px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about nutrition or meals..."
            className="w-full p-3 pr-12 border-2 border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#262626] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-300 focus-ring focus:border-green-500 resize-none"
            rows="2"
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            Press Enter ↵
          </div>
        </div>
        
        <button
          onClick={sendMessage}
          disabled={!chatInput.trim() || isTyping}
          className={`px-4 py-3 rounded-xl font-medium text-white transition-all duration-300 focus-ring hover-scale ${
            !chatInput.trim() || isTyping
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {['How am I doing?', 'Suggest a meal', 'Give me tips', 'Show my progress', 'Motivate me!'].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => setChatInput(suggestion)}
            className="px-3 py-1.5 text-xs bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 hover:text-green-700 dark:hover:text-green-400 transition-all duration-300 hover-scale font-medium animate-fade-in-up border border-gray-300 dark:border-white/10"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AIAssistant;
