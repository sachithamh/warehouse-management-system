"use client";
import { useEffect, useRef } from 'react';
import { listenCollection } from '../firebase/realtimeListeners';
import { useInventoryStore } from '../../store/inventoryStore';
import { InventoryItem } from '../types/database';
import { isLowStock } from '../utils/inventoryCalculations';
import { useNotificationStore } from '../../store/notificationStore';

// Hook that subscribes to real-time inventory updates and pushes low stock notifications
export function useRealTimeInventory(options: { enableLowStockAlerts?: boolean } = { enableLowStockAlerts: true }) {
  const { setItems, items } = useInventoryStore();
  const push = useNotificationStore(s => s.push);
  const prevLowStockIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unsub = listenCollection<InventoryItem>('inventory', (data) => {
      setItems(data);
      if (options.enableLowStockAlerts) {
        const newlyLow: InventoryItem[] = [];
        const nextSet = new Set<string>();
        data.forEach(item => {
          if (isLowStock(item)) {
            nextSet.add(item.id);
            if (!prevLowStockIds.current.has(item.id)) newlyLow.push(item);
          }
        });
        if (newlyLow.length) {
          newlyLow.slice(0,3).forEach(item => {
            push({
              type: 'warning',
              title: 'Low Stock',
              message: `Item ${item.productId} low: ${item.availableQuantity} available (<= ${item.reorderLevel})`
            });
          });
          if (newlyLow.length > 3) {
            push({ type: 'warning', title: 'Multiple Low Stock Items', message: `${newlyLow.length} items newly low` });
          }
        }
        prevLowStockIds.current = nextSet;
      }
    });
    return () => unsub();
  }, [setItems, options.enableLowStockAlerts, push]);

  return { items };
}
