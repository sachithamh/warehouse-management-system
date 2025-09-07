"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useInventory } from '../../../lib/hooks/useInventory';
import StockAdjustmentForm from '../../../components/forms/StockAdjustmentForm';
import { useRealTimeInventory } from '../../../lib/hooks/useRealTimeInventory';

export default function InventoryDetailPage() {
  const params = useParams<{ id: string }>();
  const { getItem, loading } = useInventory();
  const item = getItem(params.id);
  const router = useRouter();
  const [showAdjust, setShowAdjust] = useState(false);
  useRealTimeInventory();

  if (loading && !item) return <div className="p-6 text-sm text-neutral-500">Loading...</div>;
  if (!item) return <div className="p-6 text-sm text-neutral-500">Inventory item not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => router.back()} className="text-xs text-neutral-500 hover:text-neutral-800">← Back</button>
      <h1 className="text-lg font-semibold text-neutral-900">Inventory Item</h1>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><span className="font-medium">Product ID:</span> {item.productId}</p>
          <p><span className="font-medium">Warehouse ID:</span> {item.warehouseId}</p>
          <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
          <p><span className="font-medium">Reserved:</span> {item.reservedQuantity}</p>
        </div>
        <div>
            <p><span className="font-medium">Available:</span> {item.availableQuantity}</p>
            <p><span className="font-medium">Reorder Level:</span> {item.reorderLevel}</p>
            <p><span className="font-medium">Max Level:</span> {item.maxStockLevel}</p>
            <p><span className="font-medium">Location:</span> {item.location.zone}-{item.location.rack}-{item.location.shelf}</p>
        </div>
      </div>
      <div>
        <button
          onClick={() => setShowAdjust(true)}
          className="rounded bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
        >Adjust Stock</button>
      </div>
      {showAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded bg-white p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">Adjust Stock</h2>
              <button onClick={() => setShowAdjust(false)} className="text-xs text-neutral-500 hover:text-neutral-800">✕</button>
            </div>
            <StockAdjustmentForm itemId={item.id} onSuccess={() => setShowAdjust(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
