'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { 
  BarChart3, 
  TrendingDown, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Award,
  Wallet,
  Activity
} from 'lucide-react';
import { microStxToStx, getScoreColor } from '@/lib/utils';
import PremiumChart from '@/components/PremiumChart';

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

export default function Analytics() {
  const { premiumHistory, policy, assessmentResults } = useAppStore();

  // Mock data if history is empty
  const displayHistory = premiumHistory.length > 0 ? premiumHistory : [
    {
      policyId: 1,
      adjustmentPeriod: 1,
      oldPremium: 5000000,
      newPremium: 4250000,
      adjustmentReason: "Positive lifestyle changes & high health score",
      healthImprovement: 12,
      lifestyleChange: 8,
      calculatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
      policyId: 1,
      adjustmentPeriod: 2,
      oldPremium: 4250000,
      newPremium: 3800000,
      adjustmentReason: "Sustained healthy habits & weight loss",
      healthImprovement: 5,
      lifestyleChange: 15,
      calculatedAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    }
  ];

  const totalSavings = displayHistory.reduce((acc: number, curr: any) => acc + (curr.oldPremium - curr.newPremium), 0);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Analytics & Insights</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)' }}>
          Detailed breakdown of your insurance performance and health ROI
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <motion.div variants={itemVariants} className="dh-card" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0.1))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--dh-success)', fontWeight: 600, textTransform: 'uppercase' }}>Total Savings</p>
            <TrendingDown size={18} color="var(--dh-success)" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 800 }} className="dh-gradient-text">
            {microStxToStx(totalSavings)} STX
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', marginTop: '0.5rem' }}>
            Cumulative discount from premium optimization
          </p>
        </motion.div>

        <motion.div variants={itemVariants} transition={{ delay: 0.1 }} className="dh-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Current Multiplier</p>
            <Award size={18} color="var(--dh-warning)" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            {assessmentResults?.premiumMultiplier || 100}%
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', color: 'var(--dh-success)', fontSize: '0.8rem' }}>
            <ArrowDownRight size={14} />
            Lower than market average
          </div>
        </motion.div>

        <motion.div variants={itemVariants} transition={{ delay: 0.2 }} className="dh-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>ROI Index</p>
            <TrendingUp size={18} color="#38bdf8" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            8.4<span style={{ fontSize: '1rem', color: 'var(--dh-text-muted)', fontWeight: 500 }}>/10</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', marginTop: '0.5rem' }}>
            Health value generated per STX spent
          </p>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Premium Evolution Chart */}
        <motion.div variants={itemVariants} className="dh-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <BarChart3 size={20} color="#38bdf8" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Premium Evolution</h3>
          </div>
          <div style={{ height: 300 }}>
            <PremiumChart />
          </div>
        </motion.div>

        {/* Score Trends */}
        <motion.div variants={itemVariants} className="dh-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Activity size={20} color="#ef4444" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Health vs Lifestyle Growth</h3>
          </div>
          {/* We'll use a simple colored bar visualization for trends in this v1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
            <TrendBar label="Health Score" value={assessmentResults?.healthScore || 0} growth={+12} color="#ef4444" />
            <TrendBar label="Lifestyle Score" value={assessmentResults?.lifestyleScore || 0} growth={+8} color="#22c55e" />
            <TrendBar label="System Engagement" value={100} growth={+24} color="#a855f7" />
          </div>
        </motion.div>
      </div>

      {/* Adjustment History Table */}
      <motion.div variants={itemVariants} className="dh-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <History size={20} color="var(--dh-text-muted)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Adjustment History</h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--dh-border)' }}>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--dh-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--dh-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Description</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--dh-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Old Premium</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--dh-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>New Premium</th>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--dh-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {displayHistory.map((adj: any, i: number) => (
                <tr key={i} style={{ borderBottom: i === displayHistory.length - 1 ? 'none' : '1px solid var(--dh-border)' }}>
                  <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    {new Date(adj.calculatedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--dh-text-primary)' }}>{adj.adjustmentReason}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)' }}>Health +{adj.healthImprovement}%, Life +{adj.lifestyleChange}%</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--dh-text-muted)' }}>
                    {microStxToStx(adj.oldPremium)} STX
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    {microStxToStx(adj.newPremium)} STX
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 6, 
                      background: 'rgba(34, 197, 94, 0.1)', 
                      color: 'var(--dh-success)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      -{microStxToStx(adj.oldPremium - adj.newPremium)} STX
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TrendBar({ label, value, growth, color }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--dh-text-muted)', marginBottom: '0.25rem' }}>{label}</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }} className={getScoreColor(value)}>{value}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--dh-success)', fontSize: '0.8rem', fontWeight: 600 }}>
          <ArrowUpRight size={14} /> {growth}%
        </div>
      </div>
      <div style={{ height: 8, width: '100%', borderRadius: 4, background: 'var(--dh-border)', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 4 }}
        />
      </div>
    </div>
  );
}
