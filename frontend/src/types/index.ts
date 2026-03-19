// Types matching the Clarity smart contract data structures

export interface BloodPressure {
  systolic: number;
  diastolic: number;
}

export interface HealthProfile {
  age: number;
  bmi: number;
  bloodPressure: BloodPressure;
  cholesterolLevel: number;
  smokingStatus: boolean;
  exerciseFrequency: number;
  alcoholConsumption: number;
  healthScore: number;
  lastCheckup: number;
  dataConsent: boolean;
}

export interface LifestyleMetrics {
  stepsPerDay: number;
  sleepHours: number;
  stressLevel: number;
  dietQualityScore: number;
  mentalHealthScore: number;
  socialActivityLevel: number;
  preventiveCareAdherence: number;
  lifestyleScore: number;
}

export interface InsurancePolicy {
  id: number;
  policyholder: string;
  currentPremium: number;
  basePremium: number;
  riskCategory: string;
  policyStatus: string;
  createdAt: number;
  lastPremiumAdjustment: number;
  totalPremiumsPaid: number;
  claimHistoryScore: number;
}

export interface PremiumAdjustment {
  policyId: number;
  adjustmentPeriod: number;
  oldPremium: number;
  newPremium: number;
  adjustmentReason: string;
  healthImprovement: number;
  lifestyleChange: number;
  calculatedAt: number;
}

export interface PredictiveInsights {
  projectedHealthScore6Months: number;
  projectedLifestyleImprovement: number;
  chronicDiseaseProbability: number;
  preventiveCareEffectiveness: number;
  lifestyleInterventionSuccessRate: number;
}

export interface AssessmentResults {
  policyId: number;
  assessmentTimestamp: number;
  currentRiskCategory: RiskCategory;
  healthScore: number;
  lifestyleScore: number;
  ageRiskFactor: number;
  comprehensiveRiskScore: number;
  currentPremium: number;
  optimizedPremium: number;
  premiumAdjustment: number;
  premiumMultiplier: number;
  predictiveModeling: PredictiveInsights;
  wellnessIncentivesActive: boolean;
  continuousMonitoringEnabled: boolean;
  interventionRecommendations: string[];
  nextAssessmentDue: number;
  confidenceScore: number;
}

export type RiskCategory = 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK' | 'VERY_HIGH_RISK' | 'PENDING_ASSESSMENT';

export type TransactionStatus = 'idle' | 'pending' | 'success' | 'error';

export interface TransactionState {
  status: TransactionStatus;
  txId?: string;
  error?: string;
}

// Contract error codes mapping
export const CONTRACT_ERRORS: Record<number, string> = {
  200: 'Unauthorized: You do not have permission',
  201: 'Invalid Data: Please check your input values',
  202: 'Policy Not Found',
  203: 'Insufficient Premium Amount',
  204: 'Health Data Access Denied',
  205: 'Invalid Risk Category',
  206: 'Premium Calculation Error',
};

// Contract constants
export const CONTRACT_CONSTANTS = {
  BASE_PREMIUM: 5_000_000, // 5 STX in microSTX
  MAX_PREMIUM_MULTIPLIER: 300,
  MIN_PREMIUM_MULTIPLIER: 50,
  HEALTH_SCORE_WEIGHT: 40,
  LIFESTYLE_SCORE_WEIGHT: 30,
  AGE_RISK_WEIGHT: 20,
  GENETIC_RISK_WEIGHT: 10,
  PREMIUM_ADJUSTMENT_PERIOD: 2016,
} as const;
