"use client";
import React, { useEffect } from 'react';
import InventoryChart from '../../../components/features/inventory/InventoryChart';
import { useInventory } from '../../../lib/hooks/useInventory';
import { useWarehouseStore } from '../../../store/warehouseStore';
import { useProductStore } from '../../../store/productStore';

export default function InventoryReportsPage() {
  const { fetchInventory } = useInventory();
  const { warehouses, fetchWarehouses } = useWarehouseStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(()=> {
    if (!warehouses.length) fetchWarehouses();
    if (!products.length) fetchProducts();
    // inventory is fetched in useInventory if empty
  }, [warehouses.length, products.length, fetchWarehouses, fetchProducts]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Inventory Reports</h1>
      </div>
      <InventoryChart />
    </div>
  );
}
