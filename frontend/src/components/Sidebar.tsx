'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { 
  LayoutDashboard, 
  HeartPulse, 
  Activity, 
  Shield, 
  CreditCard, 
  Brain, 
  BarChart3,
  Moon,
  Sun,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import WalletConnect from '@/components/WalletConnect';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'health', label: 'Health Profile', icon: HeartPulse },
  { id: 'lifestyle', label: 'Lifestyle', icon: Activity },
  { id: 'policy', label: 'Insurance', icon: Shield },
  { id: 'payment', label: 'Premium', icon: CreditCard },
  { id: 'assessment', label: 'Risk Engine', icon: Brain },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, darkMode, toggleDarkMode, isConnected, disconnect } = useAppStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="dh-sidebar" style={{
        width: 260,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'var(--dh-bg-secondary)',
        borderRight: '1px solid var(--dh-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        padding: '1.5rem 0.75rem',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 0.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--dh-accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <HeartPulse size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                <span className="dh-gradient-text">Dynamic</span>Health
              </h1>
              <p style={{ fontSize: '0.65rem', color: 'var(--dh-text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Insurance dApp
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`dh-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--dh-border)' }}>
          <button className="dh-nav-item" onClick={toggleDarkMode}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          {isConnected && (
            <button className="dh-nav-item" onClick={disconnect} style={{ color: 'var(--dh-danger)' }}>
              <LogOut size={18} />
              Disconnect
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="dh-mobile-nav" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        background: 'var(--dh-bg-secondary)',
        borderBottom: '1px solid var(--dh-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--dh-accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <HeartPulse size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }} className="dh-gradient-text">DynamicHealth</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--dh-text-primary)', cursor: 'pointer' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -260 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -260 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: 60,
              left: 0,
              bottom: 0,
              width: 260,
              background: 'var(--dh-bg-secondary)',
              borderRight: '1px solid var(--dh-border)',
              zIndex: 49,
              padding: '1rem 0.75rem',
              overflowY: 'auto',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`dh-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => { setActiveTab(item.id); setMobileOpen(false); }}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              top: 60,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 48,
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
