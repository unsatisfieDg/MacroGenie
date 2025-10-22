import { useState } from 'react';
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateMacros,
  calculateBMI,
  getBMICategory,
  calculateIdealWeight,
  calculateWaterIntake,
  calculateFiberIntake,
  getGoalRecommendations
} from '../utils/nutritionCalculator';

function useNutrition(userData, profile = {}) {
  const [nutrition, setNutrition] = useState({
    bmr: 0, 
    tdee: 0, 
    protein: 0, 
    carbs: 0, 
    fats: 0,
    bmi: 0,
    bmiCategory: '',
    bmiColor: '',
    idealWeight: { min: 0, max: 0 },
    waterIntake: 0,
    fiberIntake: 0,
    proteinGPerKg: 0,
    calorieAdjustment: '',
    goalRecommendations: {},
    referenceWeight: 0,
    currentWeightUsed: false
  });

  const calculateNutrition = () => {
    if (!userData.weight || !userData.height || !userData.age) {
      return;
    }

    const bmr = calculateBMR(userData);
    const tdee = calculateTDEE(bmr, userData.activityLevel, userData.goal);
    const macros = calculateMacros(tdee, userData.goal, userData, profile);
    const bmi = calculateBMI(userData.weight, userData.height);
    const bmiCategory = getBMICategory(bmi);
    const idealWeight = calculateIdealWeight(userData.height, userData.gender);
    const waterIntake = calculateWaterIntake(userData.weight, userData.activityLevel);
    const fiberIntake = calculateFiberIntake(tdee);
    const goalRecommendations = getGoalRecommendations(userData.goal);
    
    setNutrition({
      bmr: Math.round(bmr),
      tdee: macros.tdee || tdee,
      protein: macros.protein,
      carbs: macros.carbs,
      fats: macros.fats,
      bmi: bmi,
      bmiCategory: bmiCategory.category,
      bmiColor: bmiCategory.color,
      bmiRecommendation: bmiCategory.recommendation,
      idealWeight: idealWeight,
      waterIntake: waterIntake,
      fiberIntake: fiberIntake,
      proteinGPerKg: macros.proteinGPerKg,
      proteinGPerLb: macros.proteinGPerLb,
      carbsGPerLb: macros.carbsGPerLb,
      proteinPercent: macros.proteinPercent,
      carbsPercent: macros.carbsPercent,
      calorieAdjustment: macros.calorieAdjustment,
      goalRecommendations: goalRecommendations,
      referenceWeight: macros.referenceWeight,
      referenceWeightLbs: macros.referenceWeightLbs,
      currentWeightUsed: macros.currentWeightUsed,
      targetWeight: profile.targetWeight
    });
  };

  return { nutrition, calculateNutrition };
}

export default useNutrition;