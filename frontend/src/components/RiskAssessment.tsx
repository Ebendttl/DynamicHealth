'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { 
  Brain, 
  SwitchCamera, 
  Zap, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Info
} from 'lucide-react';
import { buildRiskAssessment } from '@/lib/contract';
import { microStxToStx, getRiskColor, getRiskBgColor, getRiskLabel, getScoreColor } from '@/lib/utils';
import ScoreGauge from '@/components/ScoreGauge';
import { openContractCall } from '@stacks/connect';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function RiskAssessment() {
  const { 
    policy, 
    healthProfile, 
    lifestyleMetrics, 
    assessmentResults, 
    setAssessmentResults,
    setTxState 
  } = useAppStore();

  const [options, setOptions] = useState({
    includePredictiveModeling: true,
    enableWellnessIncentives: true,
    activateContinuousMonitoring: false,
    generateInterventionRecommendations: true,
  });

  const [isExecuting, setIsExecuting] = useState(false);

  const handleToggle = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const executeAssessment = async () => {
    if (!policy) return;

    setIsExecuting(true);
    setTxState({ status: 'pending' });

    try {
      const callOptions = buildRiskAssessment({
        policyId: policy.id,
        ...options
      });

      await openContractCall({
        ...callOptions,
        onFinish: (data: any) => {
          console.log('Assessment finished:', data);
          setTxState({ status: 'success', txId: data.txId });
          // In a real app, we would wait for confirmation and then fetch the actual results
          // For this demo, we'll simulate a result update after a short delay
          setTimeout(() => {
            const simulatedResults = {
              policyId: policy.id,
              assessmentTimestamp: Date.now(),
              currentRiskCategory: 'LOW_RISK' as any,
              healthScore: healthProfile?.healthScore || 85,
              lifestyleScore: lifestyleMetrics?.lifestyleScore || 78,
              ageRiskFactor: 15,
              comprehensiveRiskScore: 82,
              currentPremium: policy.currentPremium,
              optimizedPremium: Math.floor(policy.currentPremium * 0.85),
              premiumAdjustment: Math.floor(policy.currentPremium * 0.15),
              premiumMultiplier: 85,
              predictiveModeling: {
                projectedHealthScore6Months: 88,
                projectedLifestyleImprovement: 10,
                chronicDiseaseProbability: 5,
                preventiveCareEffectiveness: 92,
                lifestyleInterventionSuccessRate: 88,
              },
              wellnessIncentivesActive: options.enableWellnessIncentives,
              continuousMonitoringEnabled: options.activateContinuousMonitoring,
              interventionRecommendations: [
                "Increase cardio exercise to 4 times per week",
                "Maintain consistent sleep schedule (7-8 hours)",
                "Add more plant-based proteins to your diet",
                "Perform a deep meditation session twice weekly"
              ],
              nextAssessmentDue: Date.now() + 30 * 24 * 60 * 60 * 1000,
              confidenceScore: 94,
            };
            setAssessmentResults(simulatedResults);
            setIsExecuting(false);
          }, 2000);
        },
        onCancel: () => {
          setTxState({ status: 'idle' });
          setIsExecuting(false);
        },
      });
    } catch (error) {
      console.error('Assessment failed:', error);
      setTxState({ status: 'error', error: 'Assessment execution failed' });
      setIsExecuting(false);
    }
  };

  const canExecute = !!policy && !!healthProfile && !!lifestyleMetrics;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Risk Assessment Engine</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)' }}>
          Execute AI-driven health risk assessment and premium optimization
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Trigger Panel */}
        <motion.div variants={itemVariants} className="dh-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(129, 140, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={20} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Assessment Configuration</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <ToggleOption 
              icon={<SwitchCamera size={16} />}
              label="Predictive Modeling"
              description="Forecast health trends for the next 6-12 months"
              active={options.includePredictiveModeling}
              onToggle={() => handleToggle('includePredictiveModeling')}
            />
            <ToggleOption 
              icon={<Zap size={16} />}
              label="Wellness Incentives"
              description="Unlock premium discounts for healthy behavior"
              active={options.enableWellnessIncentives}
              onToggle={() => handleToggle('enableWellnessIncentives')}
            />
            <ToggleOption 
              icon={<Activity size={16} />}
              label="Continuous Monitoring"
              description="Sync real-time data from wearable devices"
              active={options.activateContinuousMonitoring}
              onToggle={() => handleToggle('activateContinuousMonitoring')}
            />
            <ToggleOption 
              icon={<Sparkles size={16} />}
              label="AI Interventions"
              description="Generate personalized wellness recommendations"
              active={options.generateInterventionRecommendations}
              onToggle={() => handleToggle('generateInterventionRecommendations')}
            />
          </div>

          {!canExecute && (
            <div style={{ 
              padding: '1rem', 
              borderRadius: 12, 
              background: 'rgba(245, 158, 11, 0.05)', 
              border: '1px solid rgba(245, 158, 11, 0.2)',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '0.75rem'
            }}>
              <AlertCircle size={18} color="var(--dh-warning)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--dh-warning)', marginBottom: '0.25rem' }}>Missing Requirements</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-secondary)' }}>
                  You must complete your Health Profile, Lifestyle Metrics, and Insurance Policy before executing an assessment.
                </p>
              </div>
            </div>
          )}

          <button 
            className={`dh-btn dh-btn-primary ${(!canExecute || isExecuting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ width: '100%', height: 50, fontSize: '1rem' }}
            disabled={!canExecute || isExecuting}
            onClick={executeAssessment}
          >
            {isExecuting ? 'Optimizing Premium...' : 'Execute Assessment & Optimize'}
            {!isExecuting && <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />}
          </button>
        </motion.div>

        {/* Results Preview / Current Status */}
        <motion.div variants={itemVariants} className="dh-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Assessment Results</h3>
            {assessmentResults && (
              <span className={`dh-badge ${getRiskBgColor(assessmentResults.currentRiskCategory)}`}>
                <span className={getRiskColor(assessmentResults.currentRiskCategory)}>
                  {getRiskLabel(assessmentResults.currentRiskCategory)}
                </span>
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!assessmentResults ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  minHeight: 300,
                  textAlign: 'center',
                  padding: '1rem'
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--dh-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--dh-text-muted)' }}>
                  <ShieldCheck size={32} />
                </div>
                <p style={{ fontWeight: 600, color: 'var(--dh-text-primary)', marginBottom: '0.5rem' }}>No Assessment Data</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)', maxWidth: 240 }}>
                  Execute your first assessment to unlock personalized premium optimization.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                  <ScoreGauge 
                    score={assessmentResults.comprehensiveRiskScore} 
                    maxScore={100}
                    label="Risk Score"
                    color={getRiskColor(assessmentResults.currentRiskCategory)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="dh-card" style={{ padding: '0.75rem', background: 'var(--dh-bg-secondary)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Health</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700 }} className={getScoreColor(assessmentResults.healthScore)}>{assessmentResults.healthScore}</p>
                  </div>
                  <div className="dh-card" style={{ padding: '0.75rem', background: 'var(--dh-bg-secondary)' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Lifestyle</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700 }} className={getScoreColor(assessmentResults.lifestyleScore)}>{assessmentResults.lifestyleScore}</p>
                  </div>
                </div>

                <div className="dh-card" style={{ 
                  background: 'rgba(34, 197, 94, 0.05)', 
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--dh-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <TrendingDown size={14} /> Optimized Premium
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800 }} className="dh-gradient-text">
                      {microStxToStx(assessmentResults.optimizedPremium)} STX
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--dh-text-muted)' }}>Saving</p>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--dh-success)' }}>
                      -{microStxToStx(assessmentResults.premiumAdjustment)} STX
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {assessmentResults && (
        <motion.div variants={itemVariants} className="dh-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Sparkles size={20} color="var(--dh-warning)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Personalized Recommendations</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {assessmentResults.interventionRecommendations.map((rec: string, i: number) => (
              <motion.div 
                key={i}
                whileHover={{ y: -2 }}
                style={{ 
                  padding: '1rem', 
                  borderRadius: 12, 
                  background: 'var(--dh-bg-secondary)', 
                  border: '1px solid var(--dh-border)',
                  display: 'flex',
                  gap: '0.75rem'
                }}
              >
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Info size={14} color="#38bdf8" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--dh-text-secondary)', lineHeight: 1.5 }}>{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ToggleOption({ icon, label, description, active, onToggle }: {
  icon: React.ReactNode;
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: 8, 
          background: active ? 'rgba(56, 189, 248, 0.1)' : 'var(--dh-bg-secondary)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: active ? '#38bdf8' : 'var(--dh-text-muted)',
          transition: 'all 0.2s'
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--dh-text-primary)' }}>{label}</p>
          <p style={{ fontSize: '0.7rem', color: 'var(--dh-text-muted)' }}>{description}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`dh-toggle ${active ? 'active' : ''}`}
      />
    </div>
  );
}
