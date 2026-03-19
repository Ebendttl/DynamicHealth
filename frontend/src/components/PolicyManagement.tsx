'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { buildCreateInsurancePolicy } from '@/lib/contract';
import { microStxToStx, getRiskColor, getRiskBgColor, getRiskLabel } from '@/lib/utils';
import { Shield, Plus, AlertTriangle, CheckCircle2, Clock, CreditCard, Hash } from 'lucide-react';

export default function PolicyManagement() {
  const { healthProfile, policy, setPolicy, setTxState } = useAppStore();

  const handleCreatePolicy = async () => {
    if (!healthProfile) return;
    setTxState({ status: 'pending' });
    try {
      const { showContractCall } = await import('@stacks/connect');
      const opts = buildCreateInsurancePolicy();
      await showContractCall({
        ...opts,
        onFinish: (txData: any) => {
          setTxState({ status: 'success', txId: txData.txId });
          setPolicy({
            id: 1,
            policyholder: '',
            currentPremium: 5_000_000,
            basePremium: 5_000_000,
            riskCategory: 'PENDING_ASSESSMENT',
            policyStatus: 'ACTIVE',
            createdAt: Date.now(),
            lastPremiumAdjustment: Date.now(),
            totalPremiumsPaid: 0,
            claimHistoryScore: 100,
          });
        },
        onCancel: () => setTxState({ status: 'idle' }),
      });
    } catch {
      setPolicy({
        id: 1,
        policyholder: '',
        currentPremium: 5_000_000,
        basePremium: 5_000_000,
        riskCategory: 'PENDING_ASSESSMENT',
        policyStatus: 'ACTIVE',
        createdAt: Date.now(),
        lastPremiumAdjustment: Date.now(),
        totalPremiumsPaid: 0,
        claimHistoryScore: 100,
      });
      setTxState({ status: 'success' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={24} color="#38bdf8" />
          Insurance Policy
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)' }}>
          Manage your health insurance coverage
        </p>
      </div>

      {!policy ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dh-card"
          style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
        >
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'rgba(56, 189, 248, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Shield size={36} color="#38bdf8" />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Policy</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            Create an insurance policy to start your coverage. Your premium will be calculated based on your health and lifestyle data.
          </p>

          {!healthProfile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center',
              padding: '0.75rem',
              background: 'rgba(251, 191, 36, 0.08)',
              borderRadius: 'var(--dh-radius-sm)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              marginBottom: '1rem',
            }}>
              <AlertTriangle size={16} color="#fbbf24" />
              <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
                Create a health profile first to enable policy creation
              </span>
            </div>
          )}

          <motion.button
            className="dh-btn dh-btn-primary"
            disabled={!healthProfile}
            onClick={handleCreatePolicy}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} />
            Create Insurance Policy
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dh-card"
          style={{
            background: 'linear-gradient(135deg, var(--dh-bg-card), rgba(56, 189, 248, 0.03))',
            border: '1px solid rgba(56, 189, 248, 0.15)',
          }}
        >
          {/* Policy Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--dh-accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield size={24} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>DynamicHealth Policy</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)' }}>Policy #{policy.id}</p>
              </div>
            </div>
            <span className={`dh-badge ${getRiskBgColor(policy.riskCategory)}`}>
              <span className={getRiskColor(policy.riskCategory)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={12} /> {policy.policyStatus}
              </span>
            </span>
          </div>

          {/* Policy Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}>
            {[
              { icon: <Hash size={14} />, label: 'Policy ID', value: `#${policy.id}` },
              { icon: <CreditCard size={14} />, label: 'Current Premium', value: `${microStxToStx(policy.currentPremium)} STX`, highlight: true },
              { icon: <Shield size={14} />, label: 'Risk Category', value: getRiskLabel(policy.riskCategory), colorClass: getRiskColor(policy.riskCategory) },
              { icon: <CreditCard size={14} />, label: 'Total Paid', value: `${microStxToStx(policy.totalPremiumsPaid)} STX` },
              { icon: <Clock size={14} />, label: 'Base Premium', value: `${microStxToStx(policy.basePremium)} STX` },
              { icon: <CheckCircle2 size={14} />, label: 'Claim Score', value: `${policy.claimHistoryScore}/100` },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '0.75rem',
                background: 'var(--dh-bg-secondary)',
                borderRadius: 'var(--dh-radius-sm)',
                border: '1px solid var(--dh-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', color: 'var(--dh-text-muted)', fontSize: '0.7rem' }}>
                  {item.icon} {item.label}
                </div>
                <p style={{ fontSize: item.highlight ? '1.1rem' : '0.95rem', fontWeight: 700 }} className={item.colorClass || (item.highlight ? 'dh-gradient-text' : '')}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
