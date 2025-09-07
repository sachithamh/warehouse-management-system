"use client";
import { useEffect } from 'react';
import { useWarehouseStore } from './../../store/warehouseStore';

// Thin wrapper hook (future: query params, filtering, pagination)
export function useWarehouses() {
  const { warehouses, loading, error, fetchWarehouses } = useWarehouseStore();
  useEffect(() => {
    if (!warehouses.length) {
      fetchWarehouses();
    }
  }, [warehouses.length, fetchWarehouses]);
  return useWarehouseStore();
}
