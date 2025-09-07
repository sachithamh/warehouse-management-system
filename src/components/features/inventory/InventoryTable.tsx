"use client";
import React from 'react';
import { useInventory } from '../../../lib/hooks/useInventory';
import { useProducts } from '../../../lib/hooks/useProducts';
import { useWarehouses } from '../../../lib/hooks/useWarehouses';
import { isLowStock, reorderSuggestion } from '../../../lib/utils/inventoryCalculations';
import StockLevelIndicator from './StockLevelIndicator';

export const InventoryTable: React.FC = () => {
  const { items, loading, error } = useInventory();
  const { products } = useProducts();
  const { warehouses } = useWarehouses();

  const productMap = React.useMemo(() => Object.fromEntries(products.map(p => [p.id, p])), [products]);
  const warehouseMap = React.useMemo(() => Object.fromEntries(warehouses.map(w => [w.id, w])), [warehouses]);

  if (loading) return <p className="text-sm text-neutral-500">Loading inventory...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div className="overflow-x-auto rounded border border-neutral-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-neutral-50 text-[11px] uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-3 py-2 font-medium">Product</th>
            <th className="px-3 py-2 font-medium">Warehouse</th>
            <th className="px-3 py-2 font-medium">Quantity</th>
            <th className="px-3 py-2 font-medium">Reserved</th>
            <th className="px-3 py-2 font-medium">Available</th>
            <th className="px-3 py-2 font-medium">Level</th>
            <th className="px-3 py-2 font-medium">Reorder</th>
            <th className="px-3 py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {items.map(i => {
            const low = isLowStock(i);
            const reorderQty = reorderSuggestion(i);
            const product = productMap[i.productId];
            const warehouse = warehouseMap[i.warehouseId];
            return (
              <tr key={i.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                <td className="px-3 py-2">{product?.name || '—'}</td>
                <td className="px-3 py-2">{warehouse?.name || '—'}</td>
                <td className="px-3 py-2">{i.quantity}</td>
                <td className="px-3 py-2">{i.reservedQuantity}</td>
                <td className="px-3 py-2">{i.availableQuantity}</td>
                <td className="px-3 py-2">
                  <StockLevelIndicator available={i.availableQuantity} max={i.maxStockLevel} low={low} />
                </td>
                <td className={`px-3 py-2 ${low ? 'text-red-600 font-semibold' : 'text-neutral-500'}`}>{reorderQty || '—'}</td>
                <td className="px-3 py-2 text-right text-xs">
                  <button className="rounded bg-neutral-100 px-2 py-1 font-medium text-neutral-700 hover:bg-neutral-200">Adjust</button>
                </td>
              </tr>
            );
          })}
          {!items.length && (
            <tr>
              <td colSpan={8} className="px-3 py-6 text-center text-sm text-neutral-500">No inventory items.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
