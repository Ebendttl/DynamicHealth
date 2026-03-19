'use client';

import { create } from 'zustand';
import type {
  HealthProfile,
  LifestyleMetrics,
  InsurancePolicy,
  AssessmentResults,
  PremiumAdjustment,
  TransactionState,
} from '@/types';

interface AppState {
  // Wallet
  isConnected: boolean;
  stxAddress: string | null;
  stxBalance: number;
  setWallet: (address: string | null, balance?: number) => void;
  disconnect: () => void;

  // Health
  healthProfile: HealthProfile | null;
  setHealthProfile: (p: HealthProfile | null) => void;

  // Lifestyle
  lifestyleMetrics: LifestyleMetrics | null;
  setLifestyleMetrics: (m: LifestyleMetrics | null) => void;

  // Policy
  policy: InsurancePolicy | null;
  setPolicy: (p: InsurancePolicy | null) => void;

  // Assessment
  assessmentResults: AssessmentResults | null;
  setAssessmentResults: (r: AssessmentResults | null) => void;

  // Premium History
  premiumHistory: PremiumAdjustment[];
  addPremiumAdjustment: (a: PremiumAdjustment) => void;

  // Transaction
  txState: TransactionState;
  setTxState: (s: TransactionState) => void;

  // Active tab
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// @ts-ignore
export const useAppStore = create<AppState>((set: any) => ({
  // Wallet
  isConnected: false,
  stxAddress: null,
  stxBalance: 0,
  setWallet: (address: string | null, balance = 0) =>
    set({ isConnected: !!address, stxAddress: address, stxBalance: balance }),
  disconnect: () =>
    set({
      isConnected: false,
      stxAddress: null,
      stxBalance: 0,
      healthProfile: null,
      lifestyleMetrics: null,
      policy: null,
      assessmentResults: null,
      premiumHistory: [],
    }),

  // Health
  healthProfile: null,
  setHealthProfile: (p: HealthProfile | null) => set({ healthProfile: p }),

  // Lifestyle
  lifestyleMetrics: null,
  setLifestyleMetrics: (m: LifestyleMetrics | null) => set({ lifestyleMetrics: m }),

  // Policy
  policy: null,
  setPolicy: (p: InsurancePolicy | null) => set({ policy: p }),

  // Assessment
  assessmentResults: null,
  setAssessmentResults: (r: AssessmentResults | null) => set({ assessmentResults: r }),

  // Premium History
  premiumHistory: [],
  addPremiumAdjustment: (a: PremiumAdjustment) =>
    set((s: AppState) => ({ premiumHistory: [...s.premiumHistory, a] })),

  // Transaction
  txState: { status: 'idle' },
  setTxState: (s: TransactionState) => set({ txState: s }),

  // Active tab
  activeTab: 'dashboard',
  setActiveTab: (tab: string) => set({ activeTab: tab }),

  // Dark mode
  darkMode: true,
  toggleDarkMode: () => set((s: AppState) => ({ darkMode: !s.darkMode })),
}));
