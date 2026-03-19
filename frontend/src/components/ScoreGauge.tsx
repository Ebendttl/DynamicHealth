'use client';

import React from 'react';

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
  label: string;
  color?: string;
  size?: number;
}

export default function ScoreGauge({ score, maxScore, label, color, size = 180 }: ScoreGaugeProps) {
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const progress = maxScore > 0 ? Math.min(score / maxScore, 1) : 0;
  const dashOffset = circumference * (1 - progress);

  const getStrokeColor = () => {
    if (color) return undefined; // use class
    if (progress >= 0.85) return '#34d399';
    if (progress >= 0.7) return '#2dd4bf';
    if (progress >= 0.5) return '#fbbf24';
    if (progress >= 0.3) return '#fb923c';
    return '#f87171';
  };

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 180 180"
        className="score-ring"
      >
        {/* Background circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="var(--dh-bg-elevated)"
          strokeWidth="12"
        />
        {/* Progress circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={getStrokeColor() || 'var(--dh-accent-primary)'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${getStrokeColor() || 'var(--dh-accent-primary)'})`,
          }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.15rem',
      }}>
        <span style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--dh-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
      </div>
    </div>
  );
}
