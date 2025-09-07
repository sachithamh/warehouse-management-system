"use client";
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWarehouseStore } from '../../../store/warehouseStore';
import WarehouseForm from '../../../components/forms/WarehouseForm/WarehouseForm';

export default function WarehouseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getWarehouse, fetchWarehouses } = useWarehouseStore();
  const warehouse = getWarehouse(params.id);

  useEffect(() => {
    if (!warehouse) {
      fetchWarehouses();
    }
  }, [warehouse, fetchWarehouses]);

  if (!warehouse) {
    return <div className="p-6 text-sm text-neutral-500">Loading warehouse...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">{warehouse.name}</h1>
        <button onClick={() => router.push('/warehouses')} className="text-xs text-neutral-600 hover:text-neutral-900">Back</button>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border border-neutral-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-neutral-800">Overview</h2>
          <ul className="mt-3 space-y-1 text-xs text-neutral-600">
            <li><span className="font-medium text-neutral-800">Manager:</span> {warehouse.manager}</li>
            <li><span className="font-medium text-neutral-800">Location:</span> {warehouse.address.city}, {warehouse.address.country}</li>
            <li><span className="font-medium text-neutral-800">Capacity:</span> {warehouse.capacity.usedSpace}/{warehouse.capacity.totalSpace}</li>
            <li><span className="font-medium text-neutral-800">Active:</span> {warehouse.isActive ? 'Yes' : 'No'}</li>
          </ul>
        </div>
        <div className="rounded border border-neutral-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-neutral-800">Edit Warehouse</h2>
          <div className="mt-3">
            <WarehouseForm warehouseId={warehouse.id} onSuccess={() => { /* no-op keep on page */ }} />
          </div>
        </div>
      </div>
    </div>
  );
}
