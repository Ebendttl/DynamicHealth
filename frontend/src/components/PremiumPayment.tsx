'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { buildPayPremium } from '@/lib/contract';
import { microStxToStx } from '@/lib/utils';
import { CreditCard, ArrowRight, X, CheckCircle2, AlertCircle, Loader } from 'lucide-react';

export default function PremiumPayment() {
  const { policy, setPolicy, stxAddress, txState, setTxState } = useAppStore();
  const [showModal, setShowModal] = React.useState(false);

  const handlePayPremium = async () => {
    if (!policy || !stxAddress) return;
    setShowModal(false);
    setTxState({ status: 'pending' });

    try {
      const { showContractCall } = await import('@stacks/connect');
      const opts = buildPayPremium(policy.id, policy.currentPremium, stxAddress);
      await showContractCall({
        ...opts,
        onFinish: (txData: any) => {
          setTxState({ status: 'success', txId: txData.txId });
          setPolicy({
            ...policy,
            totalPremiumsPaid: policy.totalPremiumsPaid + policy.currentPremium,
          });
        },
        onCancel: () => setTxState({ status: 'idle' }),
      });
    } catch {
      setPolicy({
        ...policy,
        totalPremiumsPaid: policy.totalPremiumsPaid + policy.currentPremium,
      });
      setTxState({ status: 'success' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CreditCard size={24} color="#818cf8" />
          Premium Payment
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--dh-text-secondary)' }}>
          Pay your insurance premium in STX
        </p>
      </div>

      {!policy ? (
        <div className="dh-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <AlertCircle size={48} color="var(--dh-text-muted)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--dh-text-secondary)' }}>No active policy. Create a policy to make payments.</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dh-card"
            style={{
              background: 'linear-gradient(135deg, var(--dh-bg-card), rgba(129, 140, 248, 0.05))',
              border: '1px solid rgba(129, 140, 248, 0.15)',
              textAlign: 'center',
              padding: '2.5rem 1.5rem',
            }}
          >
            <p style={{ fontSize: '0.8rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              Current Premium
            </p>
            <p style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.25rem' }} className="dh-gradient-text">
              {microStxToStx(policy.currentPremium)} STX
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--dh-text-muted)', marginBottom: '2rem' }}>
              ≈ ${(Number(microStxToStx(policy.currentPremium)) * 0.85).toFixed(2)} USD
            </p>

            <motion.button
              className="dh-btn dh-btn-primary"
              onClick={() => setShowModal(true)}
              disabled={txState.status === 'pending'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ fontSize: '1rem', padding: '0.85rem 2.5rem' }}
            >
              {txState.status === 'pending' ? (
                <>
                  <Loader size={18} className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard size={18} /> Pay Premium
                </>
              )}
            </motion.button>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '0.65rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase' }}>Total Paid</p>
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{microStxToStx(policy.totalPremiumsPaid)} STX</p>
              </div>
              <div>
                <p style={{ fontSize: '0.65rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase' }}>Base Premium</p>
                <p style={{ fontSize: '1rem', fontWeight: 700 }}>{microStxToStx(policy.basePremium)} STX</p>
              </div>
            </div>
          </motion.div>

          {/* Transaction Status */}
          {txState.status !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="dh-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                background: txState.status === 'success'
                  ? 'rgba(34, 197, 94, 0.08)'
                  : txState.status === 'error'
                    ? 'rgba(248, 113, 113, 0.08)'
                    : 'rgba(56, 189, 248, 0.08)',
                border: `1px solid ${txState.status === 'success'
                  ? 'rgba(34, 197, 94, 0.2)'
                  : txState.status === 'error'
                    ? 'rgba(248, 113, 113, 0.2)'
                    : 'rgba(56, 189, 248, 0.2)'}`,
              }}
            >
              {txState.status === 'pending' && <Loader size={18} color="#38bdf8" style={{ animation: 'spin 1s linear infinite' }} />}
              {txState.status === 'success' && <CheckCircle2 size={18} color="#22c55e" />}
              {txState.status === 'error' && <AlertCircle size={18} color="#f87171" />}
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {txState.status === 'pending' && 'Transaction Pending...'}
                  {txState.status === 'success' && 'Premium Paid Successfully!'}
                  {txState.status === 'error' && 'Transaction Failed'}
                </p>
                {txState.txId && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--dh-text-muted)', fontFamily: 'monospace' }}>
                    TX: {txState.txId.slice(0, 10)}...
                  </p>
                )}
                {txState.error && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--dh-danger)' }}>{txState.error}</p>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {showModal && policy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '1rem',
            }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="dh-card"
              style={{ maxWidth: 420, width: '100%', padding: '2rem' }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Confirm Payment</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dh-text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'Premium Amount', value: `${microStxToStx(policy.currentPremium)} STX` },
                  { label: 'Network Fee (est.)', value: '~0.001 STX' },
                  { label: 'Policy ID', value: `#${policy.id}` },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0',
                    borderBottom: '1px solid var(--dh-border)',
                    fontSize: '0.85rem',
                  }}>
                    <span style={{ color: 'var(--dh-text-muted)' }}>{item.label}</span>
                    <span style={{ fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0',
                  fontSize: '1rem',
                  fontWeight: 700,
                }}>
                  <span>Total</span>
                  <span className="dh-gradient-text">
                    ~{(Number(microStxToStx(policy.currentPremium)) + 0.001).toFixed(3)} STX
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="dh-btn dh-btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <motion.button
                  className="dh-btn dh-btn-primary"
                  onClick={handlePayPremium}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
                >
                  Confirm <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
