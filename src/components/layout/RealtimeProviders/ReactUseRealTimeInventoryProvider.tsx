"use client";
import React from 'react';
import { useRealTimeInventory } from '../../../lib/hooks/useRealTimeInventory';

// Simple provider component to activate realtime inventory subscription globally.
export default function ReactUseRealTimeInventoryProvider({ children }: { children: React.ReactNode }) {
  useRealTimeInventory({ enableLowStockAlerts: true });
  return <>{children}</>;
}
