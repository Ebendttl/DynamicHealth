/**
 * Mirror of Clarity contract calculation logic.
 * These functions replicate the on-chain scoring algorithms
 * so the UI can show real-time previews before submitting.
 */

import { CONTRACT_CONSTANTS, type RiskCategory } from '@/types';

const { BASE_PREMIUM, HEALTH_SCORE_WEIGHT, LIFESTYLE_SCORE_WEIGHT, AGE_RISK_WEIGHT } = CONTRACT_CONSTANTS;

/** Mirror of contract: calculate-age-risk-factor */
export function calculateAgeRiskFactor(age: number): number {
  if (age <= 25) return 80;
  if (age <= 35) return 90;
  if (age <= 45) return 100;
  if (age <= 55) return 110;
  if (age <= 65) return 130;
  return 150;
}

/** Mirror of contract: calculate-health-score */
export function calculateHealthScore(data: {
  bmi: number;
  systolic: number;
  cholesterol: number;
  smokingStatus: boolean;
  exerciseFrequency: number;
}): number {
  const bmiScore = (data.bmi >= 185 && data.bmi <= 250) ? 100 : 70;
  const bpScore = data.systolic <= 120 ? 100 : (data.systolic <= 140 ? 80 : 60);
  const cholesterolScore = data.cholesterol <= 200 ? 100 : 70;
  const smokingPenalty = data.smokingStatus ? 50 : 100;
  const exerciseBonus = data.exerciseFrequency >= 4 ? 110 : 90;

  return Math.floor((bmiScore + bpScore + cholesterolScore + smokingPenalty + exerciseBonus) / 5);
}

/** Mirror of contract: calculate-lifestyle-score */
export function calculateLifestyleScore(data: {
  stepsPerDay: number;
  sleepHours: number;
  stressLevel: number;
  dietScore: number;
  mentalScore: number;
}): number {
  const stepsScore = data.stepsPerDay >= 8000 ? 100 : 80;
  const sleepScore = (data.sleepHours >= 7 && data.sleepHours <= 9) ? 100 : 70;
  const stressScore = data.stressLevel <= 3 ? 100 : 60;

  return Math.floor((stepsScore + sleepScore + stressScore + data.dietScore + data.mentalScore) / 5);
}

/** Mirror of contract: determine-risk-category */
export function determineRiskCategory(
  healthScore: number,
  lifestyleScore: number,
  geneticScore: number = 75
): RiskCategory {
  const combinedScore =
    Math.floor((healthScore * 50) / 100) +
    Math.floor((lifestyleScore * 30) / 100) +
    Math.floor((geneticScore * 20) / 100);

  if (combinedScore >= 90) return 'LOW_RISK';
  if (combinedScore >= 70) return 'MODERATE_RISK';
  if (combinedScore >= 50) return 'HIGH_RISK';
  return 'VERY_HIGH_RISK';
}

/** Calculate estimated premium based on scores */
export function calculateEstimatedPremium(
  healthScore: number,
  lifestyleScore: number,
  ageRiskFactor: number,
  enableWellnessIncentives: boolean = false
): { premium: number; multiplier: number } {
  const comprehensiveRiskScore =
    Math.floor((healthScore * HEALTH_SCORE_WEIGHT) / 100) +
    Math.floor((lifestyleScore * LIFESTYLE_SCORE_WEIGHT) / 100) +
    Math.floor((ageRiskFactor * AGE_RISK_WEIGHT) / 100);

  let premiumMultiplier: number;
  if (comprehensiveRiskScore >= 90) {
    premiumMultiplier = enableWellnessIncentives ? 95 : 50;
  } else if (comprehensiveRiskScore >= 70) {
    premiumMultiplier = 100;
  } else if (comprehensiveRiskScore >= 50) {
    premiumMultiplier = 130;
  } else {
    premiumMultiplier = 180;
  }

  const premium = Math.floor((BASE_PREMIUM * premiumMultiplier) / 100);
  return { premium, multiplier: premiumMultiplier };
}
