// Enhanced Smart Response System
// Much more intelligent rule-based responses

/**
 * Get smart response based on user input and context
 */
export const getSmartResponse = (input, remaining, userData, nutrition, dailyLog) => {
  const lowerInput = input.toLowerCase();
  const userName = userData.name ? userData.name.split(' ')[0] : 'there';
  const goal = userData.goal || 'maintain';
  
  // Calculate percentages
  const caloriesPercent = Math.round(((dailyLog.calories || 0) / (nutrition.tdee || 1)) * 100);
  const proteinPercent = Math.round(((dailyLog.protein || 0) / (nutrition.protein || 1)) * 100);
  const carbsPercent = Math.round(((dailyLog.carbs || 0) / (nutrition.carbs || 1)) * 100);

  // Time of day
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const mealTime = hour < 11 ? 'breakfast' : hour < 16 ? 'lunch' : 'dinner';

  // ====== GREETINGS & SMALL TALK ======
  if (lowerInput.match(/^(hi|hello|hey|sup|what's up|yo|greetings|howdy)/)) {
    const responses = [
      `${greeting}, ${userName}! 👋✨\n\nReady to crush your ${goal === 'muscle' ? 'bulking 💪' : goal === 'loss' ? 'cutting 🔥' : goal === 'slowloss' ? 'weight loss 🏃' : goal === 'recomp' ? 'recomp ⚖️' : 'maintenance 🎯'} goals today?\n\n📊 Quick stats: ${caloriesPercent}% of daily calories consumed.\n\nHow can I help you today? 😊`,
      `Hey ${userName}! 🌟\n\nYou've logged ${dailyLog.calories || 0}/${nutrition.tdee || 0} calories so far. ${caloriesPercent < 30 ? 'Time to fuel up!' : caloriesPercent > 90 ? 'Almost there!' : 'Great progress!'}\n\nWhat's on your mind? 💪`,
      `${greeting}! 👋\n\nYour nutrition coach is here! You're at ${caloriesPercent}% of your daily goal.\n\n${proteinPercent < 50 ? '💪 Don\'t forget your protein!' : '✅ Protein looking good!'}\n\nWhat can I do for you?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Thank you
  if (lowerInput.match(/(thank|thanks|thx|appreciate)/)) {
    const responses = [
      `You're very welcome, ${userName}! 😊 Keep up the great work! 💪`,
      `Anytime! I'm here to help you reach your goals! 🎯✨`,
      `My pleasure! You've got this! 🔥`,
      `Happy to help! Stay consistent and you'll see results! 💯`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // How are you
  if (lowerInput.match(/(how are you|how's it going|what's up with you)/)) {
    return `I'm doing great, thanks for asking! 😊\n\nMore importantly, let's talk about YOU! You're ${caloriesPercent}% through your daily nutrition goal.\n\n${caloriesPercent < 50 ? '🍽️ Make sure to eat enough today!' : caloriesPercent > 100 ? '🎉 Goal achieved! Nice work!' : '📈 You\'re on track!'}\n\nNeed any help with your nutrition? 💪`;
  }

  // ====== PROGRESS & STATUS ======
  if (lowerInput.match(/(progress|status|how am i doing|how's my day|check|stats|numbers)/)) {
    const performanceEmoji = caloriesPercent >= 90 && caloriesPercent <= 110 ? '🎯' : caloriesPercent < 50 ? '⚠️' : caloriesPercent > 120 ? '📊' : '📈';
    const performanceMessage = caloriesPercent >= 90 && caloriesPercent <= 110 
      ? 'Perfect! You\'re right on track! 🎯'
      : caloriesPercent < 50
      ? `You're at ${caloriesPercent}% - ${timeOfDay === 'morning' ? 'plenty of time to hit your goal!' : 'let\'s add some meals!'}`
      : caloriesPercent > 120
      ? 'You\'re over your goal - that\'s okay! Just be mindful tomorrow.'
      : 'Good progress! Keep it up! 💪';

    const proteinStatus = proteinPercent >= 90 ? '✅ Excellent!' : proteinPercent >= 70 ? '📈 Good!' : proteinPercent >= 50 ? '⚠️ Catching up' : '❌ Need more!';
    const carbsStatus = carbsPercent >= 90 ? '✅ Excellent!' : carbsPercent >= 70 ? '📈 Good!' : carbsPercent >= 50 ? '⚠️ Catching up' : '❌ Need more!';

    return `${performanceEmoji} **Today's Progress Report:**\n\n**Overall:** ${caloriesPercent}% complete\n${performanceMessage}\n\n**Detailed Breakdown:**\n🔥 Calories: ${dailyLog.calories || 0}/${nutrition.tdee || 0} (${caloriesPercent}%)\n💪 Protein: ${dailyLog.protein || 0}g/${nutrition.protein || 0}g (${proteinPercent}%) ${proteinStatus}\n🌾 Carbs: ${dailyLog.carbs || 0}g/${nutrition.carbs || 0}g (${carbsPercent}%) ${carbsStatus}\n\n**Still need:**\n• ${Math.max(0, remaining.calories)} calories\n• ${Math.max(0, remaining.protein)}g protein  \n• ${Math.max(0, remaining.carbs)}g carbs\n\n${caloriesPercent >= 100 ? '🎉 Daily goal achieved! Well done!' : timeOfDay === 'evening' && caloriesPercent < 70 ? '⏰ Getting late - make sure to eat enough!' : '💪 Keep pushing forward!'}`;
  }

  // ====== MEAL SUGGESTIONS (Enhanced) ======
  if (lowerInput.match(/(suggest|meal|eat|food|hungry|breakfast|lunch|dinner|snack)/)) {
    // High protein needed
    if (remaining.protein > 40) {
      const proteinFoods = [
        { name: 'Grilled chicken breast', amount: '200g', protein: '62g', calories: '330' },
        { name: 'Salmon fillet', amount: '150g', protein: '38g', calories: '312' },
        { name: 'Lean beef steak', amount: '150g', protein: '45g', calories: '308' },
        { name: 'Tuna (canned in water)', amount: '150g', protein: '39g', calories: '174' },
        { name: 'Egg white omelet', amount: '6 eggs', protein: '35g', calories: '204' },
        { name: 'Greek yogurt bowl', amount: '300g', protein: '30g', calories: '177' },
        { name: 'Protein shake', amount: '2 scoops', protein: '48g', calories: '240' },
        { name: 'Cottage cheese', amount: '200g', protein: '24g', calories: '162' }
      ];
      const selectedFoods = proteinFoods.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      return `🍗 **High-Protein ${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)} Ideas:**\n\nYou need **${remaining.protein}g more protein** today!\n\n**Top options:**\n${selectedFoods.map(f => `• ${f.name} (${f.amount}) - ${f.protein} protein, ${f.calories} cal`).join('\n')}\n\n💡 **Pro tip:** ${goal === 'loss' || goal === 'slowloss' ? 'High protein helps preserve muscle during fat loss!' : 'Protein is essential for muscle recovery and growth!'}\n\nCalories remaining: **${remaining.calories} kcal**`;
    }
    
    // High carbs needed
    if (remaining.carbs > 60) {
      const carbFoods = [
        { name: 'Sweet potato', amount: '200g', carbs: '40g', calories: '180' },
        { name: 'Brown rice', amount: '150g cooked', carbs: '45g', calories: '167' },
        { name: 'Whole wheat pasta', amount: '100g dry', carbs: '70g', calories: '350' },
        { name: 'Oatmeal', amount: '100g', carbs: '66g', calories: '389' },
        { name: 'Quinoa', amount: '150g cooked', carbs: '39g', calories: '222' },
        { name: 'Whole grain bread', amount: '3 slices', carbs: '45g', calories: '240' },
        { name: 'Banana', amount: '2 medium', carbs: '54g', calories: '210' },
        { name: 'Rice cakes with honey', amount: '4 cakes', carbs: '50g', calories: '260' }
      ];
      const selectedFoods = carbFoods.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      return `🍚 **Carb-Rich ${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)} Ideas:**\n\nYou need **${remaining.carbs}g more carbs** for energy!\n\n**Best choices:**\n${selectedFoods.map(f => `• ${f.name} (${f.amount}) - ${f.carbs} carbs, ${f.calories} cal`).join('\n')}\n\n💡 **Pro tip:** ${hour < 14 ? 'Perfect timing! Carbs in the morning/afternoon provide sustained energy!' : 'Complex carbs = steady energy, no crash! ⚡'}\n\nCalories remaining: **${remaining.calories} kcal**`;
    }
    
    // Balanced meal needed
    if (remaining.calories > 300) {
      const balancedMeals = [
        { name: 'Chicken Caesar salad', cal: '400', p: '35g', c: '20g' },
        { name: 'Salmon with quinoa & veggies', cal: '450', p: '40g', c: '35g' },
        { name: 'Turkey avocado wrap', cal: '380', p: '28g', c: '42g' },
        { name: 'Beef stir-fry with rice', cal: '420', p: '38g', c: '45g' },
        { name: 'Greek chicken bowl', cal: '390', p: '32g', c: '38g' },
        { name: 'Tuna poke bowl', cal: '410', p: '36g', c: '40g' },
        { name: 'Chicken burrito bowl', cal: '440', p: '35g', c: '48g' },
        { name: 'Grilled fish tacos', cal: '370', p: '30g', c: '35g' }
      ];
      const selectedMeals = balancedMeals.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      return `🍽️ **Balanced ${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)} Options:**\n\nYou have **${remaining.calories} calories** left!\n\n**Complete meals:**\n${selectedMeals.map(m => `• ${m.name}\n  ${m.cal} | P: ${m.p} | C: ${m.c}`).join('\n')}\n\n**Your remaining macros:**\n• Protein: ${remaining.protein}g\n• Carbs: ${remaining.carbs}g\n\nPick one that matches your needs! 😊`;
    }
    
    // Snack needed
    if (remaining.calories > 0 && remaining.calories <= 300) {
      const snacks = [
        { name: 'Handful of almonds', cal: '160', p: '6g', c: '6g' },
        { name: 'Banana with peanut butter', cal: '200', p: '4g', c: '30g' },
        { name: 'Protein shake', cal: '150', p: '24g', c: '5g' },
        { name: 'Apple with Greek yogurt', cal: '180', p: '10g', c: '28g' },
        { name: '2 boiled eggs', cal: '140', p: '12g', c: '1g' },
        { name: 'Protein bar', cal: '200', p: '20g', c: '18g' },
        { name: 'Cottage cheese with berries', cal: '170', p: '14g', c: '15g' },
        { name: 'Rice cakes with hummus', cal: '150', p: '6g', c: '20g' }
      ];
      const selectedSnacks = snacks.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      return `🍎 **Perfect Snack Ideas:**\n\nOnly **${remaining.calories} calories** left - ideal for a snack!\n\n**Healthy options:**\n${selectedSnacks.map(s => `• ${s.name} (${s.cal})\n  P: ${s.p} | C: ${s.c}`).join('\n')}\n\n💡 ${remaining.protein > 15 ? '**Prioritize protein!** You still need ' + remaining.protein + 'g.' : 'Choose what fits your macros best!'}\n\nPick what fits! 👌`;
    }
    
    // Goal reached
    return `🎉 **Congratulations, ${userName}!**\n\nYou've hit your calorie goal for today! ${caloriesPercent >= 100 ? '💯' : ''}\n\n✅ Calories: ${dailyLog.calories}/${nutrition.tdee}\n✅ Protein: ${dailyLog.protein}g/${nutrition.protein}g\n✅ Carbs: ${dailyLog.carbs}g/${nutrition.carbs}g\n\n${caloriesPercent > 110 ? '📊 You\'re slightly over - that\'s okay! Consistency matters more than perfection.' : '🌟 Perfect balance! This is exactly what we aim for!'}\n\n${timeOfDay === 'evening' ? '💤 Rest well tonight - recovery is key!' : '💪 Keep this momentum going!'}`;
  }

  // ====== WORKOUT & EXERCISE (Enhanced) ======
  if (lowerInput.match(/(workout|exercise|gym|training|lift|cardio|run|fitness)/)) {
    const workoutType = lowerInput.includes('cardio') || lowerInput.includes('run') ? 'cardio' : 
                        lowerInput.includes('lift') || lowerInput.includes('weight') ? 'strength' : 'general';
    
    let workoutAdvice = '';
    if (workoutType === 'cardio') {
      workoutAdvice = `🏃 **Cardio Nutrition:**\n\n**Before cardio (30-60 min):**\n• Light carbs for quick energy\n• 🍌 Banana, 🍯 Toast with honey\n• Stay hydrated!\n\n**After cardio:**\n• Replenish with carbs + protein\n• 🥤 Smoothie, 🍚 Rice + protein\n• ${remaining.carbs > 30 ? 'You need ' + remaining.carbs + 'g carbs - perfect post-cardio!' : 'Carbs looking good!'}`;
    } else if (workoutType === 'strength') {
      workoutAdvice = `💪 **Strength Training Nutrition:**\n\n**Pre-workout (1-2 hours):**\n• Carbs + moderate protein\n• 🍗 Chicken + rice, 🥜 PB sandwich\n• Fuel those muscles!\n\n**Post-workout (within 2 hours):**\n• HIGH protein + carbs\n• 🍖 Steak + potato, 🥛 Protein shake + banana\n• ${remaining.protein > 30 ? '⚠️ Don\'t skip! You need ' + remaining.protein + 'g protein!' : '✅ Protein on track!'}`;
    } else {
      workoutAdvice = `💪 **Workout Nutrition Guide:**\n\n**Pre-Workout (30-60 min before):**\n• 🍌 Banana + peanut butter (quick energy)\n• 🍞 Toast with honey\n• 🥤 Protein smoothie\n• ☕ Black coffee (optional boost)\n\n**Post-Workout (within 2 hours):**\n• 🍗 Chicken + rice (muscle recovery)\n• 🥛 Protein shake + fruit\n• 🥚 Eggs + oatmeal\n• 🍖 Lean beef + sweet potato`;
    }
    
    return `${workoutAdvice}\n\n**Your current macros:**\n• Protein: ${dailyLog.protein}g/${nutrition.protein}g (${proteinPercent}%)\n• Carbs: ${dailyLog.carbs}g/${nutrition.carbs}g (${carbsPercent}%)\n\n💡 **${goal}-specific tip:**\n${goal === 'muscle' ? '🔥 Eat within 2 hours post-workout for optimal muscle growth!' : goal === 'loss' || goal === 'slowloss' ? '⚡ Strength training + high protein = preserve muscle while losing fat!' : goal === 'recomp' ? '💪 Lift heavy + eat at maintenance = simultaneous fat loss + muscle gain!' : '🎯 Consistency > perfection. Stay active and fuel properly!'}`;
  }

  // ====== WEIGHT & GOALS (Enhanced) ======
  if (lowerInput.match(/(weight|goal|target|lose|gain|bulk|cut)/)) {
    const goalMessages = {
      muscle: '💪 **Bulking Goal:**\nYou\'re building muscle! Focus on:\n• Calorie surplus (+300-500 kcal)\n• High protein (0.9g/lb)\n• Progressive overload in gym\n• Adequate rest & recovery',
      loss: '🔥 **Cutting Goal:**\nYou\'re losing fat! Remember:\n• Calorie deficit (-400-600 kcal)\n• High protein (1.1g/lb) to preserve muscle\n• Strength training\n• Patience is key!',
      slowloss: '🏃 **Slow Fat Loss Goal:**\nHealthy & sustainable! Focus on:\n• Moderate deficit (-300-500 kcal)\n• High protein (1.1g/lb)\n• Consistent training\n• Long-term habits',
      recomp: '⚖️ **Recomp Goal:**\nLose fat + gain muscle! Keys:\n• Eat at maintenance\n• Very high protein (1.05g/lb)\n• Heavy lifting required\n• Be patient - takes 6-12 months!',
      maintain: '🎯 **Maintenance Goal:**\nStay consistent with:\n• Balanced calories\n• Moderate protein (0.9g/lb)\n• Regular activity\n• Sustainable habits'
    };
    
    return `${goalMessages[goal] || goalMessages.maintain}\n\n**Your daily targets:**\n• 🔥 Calories: ${nutrition.tdee || 0} kcal\n• 💪 Protein: ${nutrition.protein || 0}g\n• 🌾 Carbs: ${nutrition.carbs || 0}g\n\n**Current progress:** ${caloriesPercent}%\n${caloriesPercent < 70 ? '\n⚡ Keep going! You\'re making progress!' : '\n🎉 Excellent work!'}\n\nKeep crushing it! 💯`;
  }

  // ====== TIPS & ADVICE (Enhanced) ======
  if (lowerInput.match(/(tip|advice|help me|guide|recommend)/)) {
    const tips = [
      '💧 **Hydration is Key:**\nDrink 2-3L water daily! More if you\'re training. Water helps with:\n• Nutrient transport\n• Temperature regulation\n• Appetite control\n• Recovery',
      '😴 **Sleep = Gains:**\nAim for 7-9 hours! During sleep:\n• Muscles recover & grow\n• Hormones balance\n• Metabolism regulates\n• Mental clarity improves',
      '🥗 **Veggies Are Essential:**\nInclude vegetables in EVERY meal!\n• Vitamins & minerals\n• Fiber for digestion\n• Low calories, high volume\n• Disease prevention',
      '📏 **Portion Control:**\nUse your hand as a guide:\n• Palm = Protein portion\n• Fist = Carb portion\n• Thumb = Fat portion\n• Handful = Veggies (unlimited!)',
      '🍽️ **Meal Frequency:**\nEat every 3-4 hours to:\n• Keep metabolism active\n• Maintain energy levels\n• Prevent overeating\n• Build consistent habits',
      '📱 **Track Everything:**\nLog all food for 2-4 weeks to:\n• Build awareness\n• Identify patterns\n• Make adjustments\n• Hit your goals faster!'
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    return `✨ **Daily Nutrition Tips:**\n\n${randomTip}\n\n**Based on your ${goal} goal:**\n${goal === 'muscle' ? '• Eat +300-500 cal surplus\n• Prioritize protein at every meal\n• Don\'t fear carbs - they fuel growth!\n• Train hard, eat big, rest well' : goal === 'loss' || goal === 'slowloss' ? '• Create -300-600 cal deficit\n• Keep protein HIGH (1.1g/lb)\n• Include strength training\n• Cardio is optional, not required' : '• Stay consistent with macros\n• Focus on whole foods\n• Build sustainable habits\n• Progress > perfection'}\n\n💪 You've got this, ${userName}!`;
  }

  // ====== RECIPE & COOKING ======
  if (lowerInput.match(/(recipe|cook|meal prep|prepare)/)) {
    return `🍳 **Quick & Healthy Recipe Ideas:**\n\n**Easy High-Protein Meals:**\n• 🍗 Grilled chicken + sweet potato + broccoli (30 min)\n• 🐟 Baked salmon + quinoa + asparagus (25 min)\n• 🥩 Stir-fry beef + rice + mixed veggies (20 min)\n• 🥚 Egg white omelet + toast + fruit (15 min)\n\n**Meal Prep Tips:**\n📦 Cook in batches (Sunday prep!)\n🥡 Use containers for portion control\n❄️ Freeze extra portions\n🔥 Reheat properly for best taste\n\n**Your macros:** ${remaining.protein}g protein, ${remaining.carbs}g carbs left today\n\nNeed specific recipes? Check the Recipe Finder! 🔍`;
  }

  // ====== CALORIES & NUMBERS ======
  if (lowerInput.match(/(calorie|how many|how much|need|left|remaining)/)) {
    return `📊 **Your Numbers Today:**\n\n**Remaining:**\n🔥 ${remaining.calories} calories\n💪 ${remaining.protein}g protein\n🌾 ${remaining.carbs}g carbs\n\n**Consumed so far:**\n✅ ${dailyLog.calories || 0}/${nutrition.tdee || 0} calories (${caloriesPercent}%)\n✅ ${dailyLog.protein || 0}/${nutrition.protein || 0}g protein (${proteinPercent}%)\n✅ ${dailyLog.carbs || 0}/${nutrition.carbs || 0}g carbs (${carbsPercent}%)\n\n${caloriesPercent < 50 ? '⏰ You still have a lot to eat today!' : caloriesPercent > 90 ? '🎯 Almost there! Just a bit more!' : '📈 Good progress! Keep it up!'}\n\n${timeOfDay === 'evening' && caloriesPercent < 70 ? '⚠️ Don\'t forget to eat enough before bed!' : ''}`;
  }

  // ====== PROTEIN QUESTIONS ======
  if (lowerInput.match(/(protein|why protein|protein important)/)) {
    return `💪 **Why Protein is CRUCIAL:**\n\n**Benefits:**\n🏗️ Builds & repairs muscle tissue\n🔥 High thermic effect (burns calories)\n😌 Keeps you full longer\n💯 Prevents muscle loss in deficit\n⚡ Supports recovery\n\n**Your protein target:** ${nutrition.protein || 0}g/day\n**Current:** ${dailyLog.protein || 0}g (${proteinPercent}%)\n**Still need:** ${remaining.protein}g\n\n**Best sources:**\n• Chicken, fish, lean beef\n• Eggs, Greek yogurt\n• Protein powder\n• Tofu, legumes\n\n${remaining.protein > 30 ? '⚠️ You need ' + remaining.protein + 'g more - prioritize protein!' : '✅ You\'re on track! Keep it up!'}\n\n${goal === 'muscle' ? '💡 Tip: 0.9g/lb for muscle building!' : goal === 'loss' || goal === 'slowloss' ? '💡 Tip: 1.1g/lb to preserve muscle during fat loss!' : '💡 Tip: Spread protein throughout the day!'}`;
  }

  // ====== HUNGRY / WHAT TO EAT ======
  if (lowerInput.match(/(hungry|starving|what.*eat|food)/)) {
    if (remaining.calories < 100) {
      return `😊 **Almost Done for Today!**\n\nYou only have **${remaining.calories} calories** left.\n\n**Light options:**\n• 🥛 Protein shake (150 cal)\n• 🍎 Apple (95 cal)\n• 🥚 1 boiled egg (70 cal)\n• ☕ Black coffee (0 cal)\n\n${timeOfDay === 'evening' ? '💤 You\'re doing great! Get some rest!' : '✅ Save room for later meals!'}\n\nYou're at ${caloriesPercent}% of your goal! 🎯`;
    }
    
    return `🍽️ **Meal Ideas Right Now:**\n\nYou have **${remaining.calories} calories** left!\n\n**Quick options:**\n${remaining.protein > 20 ? '• 🍗 Grilled chicken (200g) - 330 cal, 62g protein\n• 🐟 Tuna sandwich - 300 cal, 35g protein' : ''}\n${remaining.carbs > 40 ? '• 🍚 Rice bowl with veggies - 350 cal, 60g carbs\n• 🍝 Pasta with lean meat - 400 cal, 70g carbs' : ''}\n• 🥗 Big salad with protein - 350 cal, balanced\n• 🌯 Wrap with chicken/tuna - 380 cal, balanced\n\n**Still need:**\n• Protein: ${remaining.protein}g\n• Carbs: ${remaining.carbs}g\n\nPick what sounds good! 😋`;
  }

  // ====== PLAN MEALS / TOMORROW ======
  if (lowerInput.match(/(plan|tomorrow|schedule|organize)/)) {
    return `📅 **Meal Planning for Tomorrow:**\n\n**Daily Target:** ${nutrition.tdee || 0} calories\n**Protein:** ${nutrition.protein || 0}g | **Carbs:** ${nutrition.carbs || 0}g\n\n**Suggested Meal Plan:**\n\n🌅 **Breakfast (${Math.round((nutrition.tdee || 0) * 0.25)} cal)**\n• Eggs + oatmeal + fruit\n• OR Protein smoothie bowl\n\n🌤️ **Lunch (${Math.round((nutrition.tdee || 0) * 0.35)} cal)**\n• Chicken/fish + rice + veggies\n• OR Beef stir-fry with quinoa\n\n🌙 **Dinner (${Math.round((nutrition.tdee || 0) * 0.30)} cal)**\n• Lean protein + sweet potato + salad\n• OR Salmon with asparagus\n\n🍎 **Snacks (${Math.round((nutrition.tdee || 0) * 0.10)} cal)**\n• Greek yogurt, nuts, fruit\n• Protein bar/shake\n\n💡 **Pro tip:** Prep tonight for tomorrow! 🥡`;
  }

  // ====== POST-WORKOUT ======
  if (lowerInput.match(/(post.*workout|after.*gym|after.*train)/)) {
    return `💪 **Post-Workout Nutrition:**\n\n**CRITICAL: Eat within 2 hours!**\n\n**What you need:**\n🥛 Protein: 20-40g (fast-digesting)\n🍚 Carbs: 40-80g (replenish glycogen)\n\n**Best Post-Workout Meals:**\n• 🥤 Protein shake + banana (quick!)\n• 🍗 Chicken + rice + veggies\n• 🐟 Salmon + sweet potato\n• 🥚 Eggs + toast + fruit\n• 🥩 Lean beef + pasta\n\n**Your remaining macros:**\n• Protein: ${remaining.protein}g\n• Carbs: ${remaining.carbs}g\n\n${remaining.protein > 30 ? '⚠️ Don\'t skip protein! You need ' + remaining.protein + 'g more!' : '✅ Protein on track!'}\n\n🔥 **Why it matters:** Your muscles are PRIMED to absorb nutrients after training!`;
  }

  // ====== MOTIVATION / ENCOURAGEMENT ======
  if (lowerInput.match(/(motivate|encourage|inspire|give up|quit|hard|difficult)/)) {
    const motivationalQuotes = [
      '💪 "The only bad workout is the one that didn\'t happen!"\n\nYou\'re here, tracking your nutrition - that\'s already winning!',
      '🔥 "Success is the sum of small efforts, repeated day in and day out!"\n\nYou\'re at ' + caloriesPercent + '% today. Keep stacking those wins!',
      '⚡ "Your body can stand almost anything. It\'s your mind you have to convince!"\n\nYou\'ve got this, ' + userName + '! Stay focused!',
      '🎯 "Don\'t count the days, make the days count!"\n\nEvery meal tracked is progress. Every workout counts!',
      '💯 "The pain you feel today will be the strength you feel tomorrow!"\n\nEmbrace the process. Results are coming!'
    ];
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    
    return `${randomQuote}\n\n**Your progress:**\n• ${caloriesPercent}% of daily goal ✅\n• ${dailyLog.protein || 0}g protein consumed 💪\n• ${dailyLog.carbs || 0}g carbs for energy ⚡\n\n${goal === 'muscle' ? '🏗️ Every day you\'re building stronger!' : goal === 'loss' || goal === 'slowloss' ? '🔥 Every day you\'re getting leaner!' : '🎯 Every day you\'re getting better!'}\n\nKeep pushing, ${userName}! 🚀`;
  }

  // Default response for unmatched queries
  return getDefaultResponse(lowerInput, userName, goal, remaining, caloriesPercent);
};

// Default fallback response
const getDefaultResponse = (lowerInput, userName, goal, remaining, caloriesPercent) => {
  return `I'm here to help, ${userName}! 😊\n\nI can assist you with:\n• 📊 **Progress** - Check your daily stats\n• 🍽️ **Meal suggestions** - Get food ideas\n• 💪 **Workout** - Pre/post-workout nutrition\n• 🎯 **Goals** - Learn about your ${goal} plan\n• 💡 **Tips** - Get nutrition advice\n• 🍳 **Recipes** - Find healthy meal ideas\n\nYou're currently at **${caloriesPercent}%** of your daily goal.\nWhat would you like to know? 🚀`;
};

