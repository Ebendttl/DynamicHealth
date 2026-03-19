'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import {
  HeartPulse,
  Shield,
  CreditCard,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { microStxToStx, getRiskColor, getRiskBgColor, getRiskLabel, getScoreColor } from '@/lib/utils';
import ScoreGauge from '@/components/ScoreGauge';
import PremiumChart from '@/components/PremiumChart';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Dashboard() {
  const { healthProfile, lifestyleMetrics, policy, assessmentResults, setActiveTab } = useAppStore();

  const healthScore = healthProfile?.healthScore || assessmentResults?.healthScore || 0;
  const lifestyleScore = lifestyleMetrics?.lifestyleScore || assessmentResults?.lifestyleScore || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)' }}>
          Your health insurance overview at a glance
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        {/* Health Score */}
        <motion.div {...fadeUp} className="dh-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('health')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Health Score
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800 }} className={getScoreColor(healthScore)}>
                {healthScore || '—'}
              </p>
            </div>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HeartPulse size={22} color="#ef4444" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--dh-text-muted)' }}>
            {healthProfile ? (
              <>
                <Activity size={12} />
                Profile active
              </>
            ) : (
              <>
                <AlertTriangle size={12} color="var(--dh-warning)" />
                <span style={{ color: 'var(--dh-warning)' }}>No profile yet</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Lifestyle Score */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="dh-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('lifestyle')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Lifestyle Score
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800 }} className={getScoreColor(lifestyleScore)}>
                {lifestyleScore || '—'}
              </p>
            </div>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Activity size={22} color="#22c55e" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--dh-text-muted)' }}>
            {lifestyleMetrics ? (
              <>
                <TrendingUp size={12} color="var(--dh-success)" />
                <span style={{ color: 'var(--dh-success)' }}>Tracking active</span>
              </>
            ) : (
              <>
                <AlertTriangle size={12} color="var(--dh-warning)" />
                <span style={{ color: 'var(--dh-warning)' }}>Not tracked</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Active Policy */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="dh-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('policy')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Policy Status
              </p>
              <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                {policy ? (
                  <span className={`dh-badge ${getRiskBgColor(policy.riskCategory)}`} style={{ fontSize: '0.8rem' }}>
                    <span className={getRiskColor(policy.riskCategory)}>{policy.policyStatus}</span>
                  </span>
                ) : <span style={{ color: 'var(--dh-text-muted)' }}>No Policy</span>}
              </p>
            </div>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={22} color="#38bdf8" />
            </div>
          </div>
          {policy && (
            <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)' }}>
              Risk: {getRiskLabel(policy.riskCategory)}
            </p>
          )}
        </motion.div>

        {/* Current Premium */}
        <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="dh-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('payment')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Current Premium
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800 }}>
                {policy ? (
                  <span className="dh-gradient-text">{microStxToStx(policy.currentPremium)} STX</span>
                ) : <span style={{ color: 'var(--dh-text-muted)' }}>—</span>}
              </p>
            </div>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(129, 140, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CreditCard size={22} color="#818cf8" />
            </div>
          </div>
          {policy && (
            <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)' }}>
              Total paid: {microStxToStx(policy.totalPremiumsPaid)} STX
            </p>
          )}
        </motion.div>
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Risk Score Gauge */}
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="dh-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--dh-text-secondary)' }}>
            Comprehensive Risk Score
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ScoreGauge
              score={assessmentResults?.comprehensiveRiskScore || 0}
              maxScore={100}
              label={assessmentResults ? getRiskLabel(assessmentResults.currentRiskCategory) : 'No Data'}
              color={assessmentResults ? getRiskColor(assessmentResults.currentRiskCategory) : 'var(--dh-text-muted)'}
            />
          </div>
        </motion.div>

        {/* Premium Trend */}
        <motion.div {...fadeUp} transition={{ delay: 0.5 }} className="dh-card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--dh-text-secondary)' }}>
            Premium Trend
          </h3>
          <PremiumChart />
        </motion.div>
      </div>

      {/* Quick Actions */}
      {(!healthProfile || !lifestyleMetrics || !policy) && (
        <motion.div {...fadeUp} transition={{ delay: 0.6 }} className="dh-card" style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(129, 140, 248, 0.05))',
          border: '1px solid rgba(56, 189, 248, 0.2)',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
            🚀 Get Started
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { id: 'health' as const, label: 'Create Health Profile', icon: HeartPulse, show: !healthProfile },
              { id: 'lifestyle' as const, label: 'Add Lifestyle Metrics', icon: Activity, show: !lifestyleMetrics },
              { id: 'policy' as const, label: 'Create Insurance Policy', icon: Shield, show: healthProfile && !policy },
            ].filter(item => item.show).map((item: any) => (
              <button key={item.id} className="dh-btn dh-btn-secondary" onClick={() => setActiveTab(item.id)} style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <item.icon size={16} /> {item.label}
                </span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
