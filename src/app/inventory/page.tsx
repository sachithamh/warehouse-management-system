"use client";
import React from 'react';
import { useRealTimeInventory } from '../../lib/hooks/useRealTimeInventory';
import InventoryTable from '../../components/features/inventory/InventoryTable';
import LowStockAlert from '../../components/features/inventory/LowStockAlert';

export default function InventoryPage() {
  // Ensure realtime subscription (also globally via provider; this is a safeguard if provider removed later)
  useRealTimeInventory();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Inventory</h1>
      </div>
      <LowStockAlert />
      <InventoryTable />
    </div>
  );
}
