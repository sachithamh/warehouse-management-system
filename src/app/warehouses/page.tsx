"use client";
import React from 'react';
import { useWarehouses } from '../../lib/hooks/useWarehouses';
import WarehouseCard from '../../components/features/warehouses/WarehouseCard';
import WarehouseForm from '../../components/forms/WarehouseForm/WarehouseForm';
import { useWarehouseStore } from '../../store/warehouseStore';

export default function WarehousesPage() {
  const { warehouses, loading, error, setSelected, selected } = useWarehouses();
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | undefined>(undefined);
  const { removeWarehouse } = useWarehouseStore();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Warehouses</h1>
        <button
          onClick={() => { setEditingId(undefined); setShowForm(true); }}
          className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >New Warehouse</button>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-4 text-sm text-neutral-500">Loading warehouses...</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {warehouses.map((w: any) => (
          <WarehouseCard
            key={w.id}
            warehouse={w}
            onSelect={(wh) => setSelected(wh)}
            onEdit={(wh) => { setEditingId(wh.id); setShowForm(true); }}
            onDelete={async (wh) => { if (confirm('Delete warehouse?')) await removeWarehouse(wh.id); }}
          />
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded bg-white p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">{editingId ? 'Edit Warehouse' : 'Create Warehouse'}</h2>
              <button onClick={() => setShowForm(false)} className="text-xs text-neutral-500 hover:text-neutral-800">✕</button>
            </div>
            <WarehouseForm
              warehouseId={editingId}
              onSuccess={() => { setShowForm(false); setEditingId(undefined); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
