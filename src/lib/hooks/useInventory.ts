"use client";
import { useEffect } from 'react';
import { useInventoryStore } from '../../store/inventoryStore';

export function useInventory() {
  const { items, fetchInventory } = useInventoryStore();
  useEffect(() => {
    if (!items.length) fetchInventory();
  }, [items.length, fetchInventory]);
  return useInventoryStore();
}
