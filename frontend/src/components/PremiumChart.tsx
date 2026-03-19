'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAppStore } from '@/stores/app-store';
import { microStxToStx } from '@/lib/utils';

export default function PremiumChart() {
  const { premiumHistory, policy } = useAppStore();

  // Generate chart data from premium history or mock data
  const chartData = React.useMemo(() => {
    if (premiumHistory.length > 0) {
      return premiumHistory.map((adj, i) => ({
        period: `Period ${i + 1}`,
        premium: Number(microStxToStx(adj.newPremium)),
        oldPremium: Number(microStxToStx(adj.oldPremium)),
      }));
    }

    // Demo data
    return [
      { period: 'Jan', premium: 5.0, oldPremium: 5.0 },
      { period: 'Feb', premium: 5.0, oldPremium: 5.0 },
      { period: 'Mar', premium: 4.75, oldPremium: 5.0 },
      { period: 'Apr', premium: 4.5, oldPremium: 4.75 },
      { period: 'May', premium: 4.75, oldPremium: 4.5 },
      { period: 'Jun', premium: policy ? Number(microStxToStx(policy.currentPremium)) : 4.5, oldPremium: 4.75 },
    ];
  }, [premiumHistory, policy]);

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer onFinish={(data: any) => {}}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="premiumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--dh-border)" />
          <XAxis
            dataKey="period"
            tick={{ fill: 'var(--dh-text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--dh-border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--dh-text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: any) => `${v} STX`}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--dh-bg-card)',
              border: '1px solid var(--dh-border)',
              borderRadius: 10,
              color: 'var(--dh-text-primary)',
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            formatter={(value: number) => [`${value} STX`, 'Premium']}
          />
          <Area
            type="monotone"
            dataKey="premium"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#premiumGradient)"
            dot={{ fill: '#38bdf8', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
