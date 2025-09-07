"use client";
import React from 'react';

interface Props {
  available: number;
  max: number;
  low?: boolean;
  className?: string;
}

export const StockLevelIndicator: React.FC<Props> = ({ available, max, low, className }) => {
  const pct = max ? Math.min(100, (available / max) * 100) : 0;
  return (
    <div className={className}>
      <div className="mb-1 flex justify-between text-[10px] text-neutral-500">
        <span>{available} / {max}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-neutral-100">
        <div
          className={`h-full transition-all ${low ? 'bg-red-500' : 'bg-neutral-900'}`}
          style={{ width: pct + '%' }}
        />
      </div>
    </div>
  );
};

export default StockLevelIndicator;
