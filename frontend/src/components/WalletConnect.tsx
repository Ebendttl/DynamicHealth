'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { Wallet, Copy, Check, ExternalLink } from 'lucide-react';
import { truncateAddress, microStxToStx } from '@/lib/utils';

export default function WalletConnect() {
  const { isConnected, stxAddress, stxBalance, setWallet, disconnect } = useAppStore();
  const [copied, setCopied] = React.useState(false);

  const handleConnect = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const { showConnect } = await import('@stacks/connect');
      showConnect({
        appDetails: {
          name: 'DynamicHealth Insurance',
          icon: '/icon.png',
        },
        onFinish: (data: any) => {
          const address = data.userSession.loadUserData().profile.stxAddress.testnet;
          setWallet(address, 100_000_000); // Mock balance for demo
        },
        onCancel: () => {},
      });
    } catch {
      // Demo fallback: simulate connection
      const demoAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      setWallet(demoAddress, 100_000_000);
    }
  };

  const handleCopy = () => {
    if (stxAddress) {
      navigator.clipboard.writeText(stxAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <motion.button
        className="dh-btn dh-btn-primary"
        onClick={handleConnect}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ width: '100%' }}
      >
        <Wallet size={16} />
        Connect Wallet
      </motion.button>
    );
  }

  return (
    <div className="dh-card" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--dh-success)',
            boxShadow: '0 0 8px var(--dh-success)',
          }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--dh-success)', fontWeight: 600 }}>Connected</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <code style={{ fontSize: '0.8rem', color: 'var(--dh-text-secondary)', fontFamily: 'monospace' }}>
          {truncateAddress(stxAddress || '')}
        </code>
        <button
          onClick={handleCopy}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dh-text-muted)', padding: 2 }}
        >
          {copied ? <Check size={14} color="var(--dh-success)" /> : <Copy size={14} />}
        </button>
      </div>

      <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
        <span className="dh-gradient-text">{microStxToStx(stxBalance)} STX</span>
      </div>
    </div>
  );
}
