'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import HealthProfileForm from '@/components/HealthProfileForm';
import LifestyleMetricsForm from '@/components/LifestyleMetricsForm';
import PolicyManagement from '@/components/PolicyManagement';
import PremiumPayment from '@/components/PremiumPayment';
import RiskAssessment from '@/components/RiskAssessment';
import Analytics from '@/components/Analytics';
import WalletConnect from '@/components/WalletConnect';
import { Shield, Activity, HeartPulse } from 'lucide-react';

export default function Home() {
  const { activeTab, isConnected, darkMode } = useAppStore();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'health':
        return <HealthProfileForm />;
      case 'lifestyle':
        return <LifestyleMetricsForm />;
      case 'policy':
        return <PolicyManagement />;
      case 'payment':
        return <PremiumPayment />;
      case 'assessment':
        return <RiskAssessment />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex bg-zinc-50 dark:bg-black text-black dark:text-white transition-colors duration-300 min-h-screen">
        {!isConnected ? (
          <LandingState />
        ) : (
          <>
            <Sidebar />
            <main className="flex-1 lg:ml-[260px] p-6 pt-20 lg:pt-6">
              <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderActiveTab()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}

function LandingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-3xl bg-indigo-500/20 flex items-center justify-center backdrop-blur-xl border border-indigo-500/30"
        >
          <Shield size={48} className="text-indigo-500" />
        </motion.div>
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center backdrop-blur-xl border border-rose-500/30">
          <HeartPulse size={24} className="text-rose-500" />
        </div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center backdrop-blur-xl border border-emerald-500/30">
          <Activity size={24} className="text-emerald-500" />
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 dh-gradient-text">
        DynamicHealth
      </h1>
      <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-lg mb-10 leading-relaxed">
        Next-generation health insurance powered by Bitcoin. 
        Personalized premiums based on your actual wellness data.
      </p>

      <div className="w-full max-w-sm p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">
        <div className="bg-white dark:bg-black rounded-xl p-4">
          <WalletConnect />
        </div>
      </div>

      <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
        Connect your Stacks wallet to start your healthy journey.
      </p>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
        <FeatureCard 
          title="On-Chain Health" 
          desc="Immutable health profiles secured by the Stacks blockchain."
        />
        <FeatureCard 
          title="Live Optimization" 
          desc="Real-time premium adjustments as your lifestyle improves."
        />
        <FeatureCard 
          title="Privacy First" 
          desc="You own your health data. Share only what's necessary."
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left hover:border-indigo-500/50 transition-colors group">
      <h3 className="font-bold mb-2 group-hover:text-indigo-500 transition-colors">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{desc}</p>
    </div>
  );
}
