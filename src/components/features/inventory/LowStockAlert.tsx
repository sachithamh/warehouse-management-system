"use client";
import React from 'react';
import { useInventory } from '../../../lib/hooks/useInventory';
import { isLowStock } from '../../../lib/utils/inventoryCalculations';

export const LowStockAlert: React.FC = () => {
  const { items } = useInventory();
  const lowItems = items.filter(isLowStock).slice(0, 5);
  if (!lowItems.length) return null;
  return (
    <div className="rounded border border-amber-200 bg-amber-50 p-3">
      <h3 className="mb-2 text-xs font-semibold text-amber-800">Low Stock Alerts</h3>
      <ul className="space-y-1">
        {lowItems.map(i => (
          <li key={i.id} className="text-[11px] text-amber-800">
            <span className="font-medium">{i.productId}</span> — {i.availableQuantity} left (reorder ≤ {i.reorderLevel})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockAlert;
