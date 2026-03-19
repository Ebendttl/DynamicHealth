import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert microSTX to STX display string */
export function microStxToStx(microStx: number): string {
  return (microStx / 1_000_000).toFixed(2);
}

/** Convert STX to microSTX */
export function stxToMicroStx(stx: number): number {
  return Math.round(stx * 1_000_000);
}

/** Format a principal address for display */
export function truncateAddress(address: string, chars = 6): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/** Get risk category color */
export function getRiskColor(category: string): string {
  switch (category) {
    case 'LOW_RISK': return 'text-emerald-400';
    case 'MODERATE_RISK': return 'text-amber-400';
    case 'HIGH_RISK': return 'text-orange-500';
    case 'VERY_HIGH_RISK': return 'text-red-500';
    default: return 'text-slate-400';
  }
}

/** Get risk category background color */
export function getRiskBgColor(category: string): string {
  switch (category) {
    case 'LOW_RISK': return 'bg-emerald-500/15 border-emerald-500/30';
    case 'MODERATE_RISK': return 'bg-amber-500/15 border-amber-500/30';
    case 'HIGH_RISK': return 'bg-orange-500/15 border-orange-500/30';
    case 'VERY_HIGH_RISK': return 'bg-red-500/15 border-red-500/30';
    default: return 'bg-slate-500/15 border-slate-500/30';
  }
}

/** Get risk label for display */
export function getRiskLabel(category: string): string {
  switch (category) {
    case 'LOW_RISK': return 'Low Risk';
    case 'MODERATE_RISK': return 'Moderate Risk';
    case 'HIGH_RISK': return 'High Risk';
    case 'VERY_HIGH_RISK': return 'Very High Risk';
    case 'PENDING_ASSESSMENT': return 'Pending Assessment';
    default: return category;
  }
}

/** Get score color based on value (0-100) */
export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-teal-400';
  if (score >= 50) return 'text-amber-400';
  if (score >= 30) return 'text-orange-500';
  return 'text-red-500';
}
