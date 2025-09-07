"use client";
import React, { useMemo } from 'react';
import Chart from '../../ui/Chart/Chart';
import { useInventoryStore } from '../../../store/inventoryStore';
import { useWarehouseStore } from '../../../store/warehouseStore';
import { useProductStore } from '../../../store/productStore';
import { aggregateByWarehouse, aggregateByProduct, enrichWarehouseAggregates, enrichProductAggregates, buildSummary, topLowStock } from '../../../lib/utils/reportGenerator';

export default function InventoryChart() {
  const { items } = useInventoryStore();
  const { warehouses } = useWarehouseStore();
  const { products } = useProductStore();

  const summary = useMemo(()=> buildSummary(items), [items]);
  const byWh = useMemo(()=> enrichWarehouseAggregates(aggregateByWarehouse(items), warehouses), [items, warehouses]);
  const byProd = useMemo(()=> enrichProductAggregates(aggregateByProduct(items), products), [items, products]);
  const low = useMemo(()=> topLowStock(items, 8), [items]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="SKUs" value={summary.totalSKUs} />
        <MetricCard label="Total Qty" value={summary.totalQuantity} />
        <MetricCard label="Available" value={summary.totalAvailable} />
        <MetricCard label="Reserved" value={summary.totalReserved} />
        <MetricCard label="Health" value={summary.healthScore + '%'} tone={summary.healthScore>75?'good': summary.healthScore>50? 'warn':'bad'} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-xs font-semibold text-neutral-700">Stock by Warehouse</h3>
          <Chart type="bar" data={byWh} xKey="warehouseName" yKey="totalQuantity" />
        </div>
        <div className="rounded border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-xs font-semibold text-neutral-700">Availability by Product (Top 10)</h3>
          <Chart type="bar" data={[...byProd].sort((a,b)=>b.totalAvailable-a.totalAvailable).slice(0,10)} xKey="productName" yKey="totalAvailable" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-xs font-semibold text-neutral-700">Low Stock Items</h3>
          <ul className="space-y-2 max-h-64 overflow-auto pr-1 text-[11px]">
            {low.map(l => (
              <li key={l.id} className="flex items-center justify-between rounded border border-neutral-100 bg-neutral-50 px-2 py-1">
                <span className="truncate">{l.productId}</span>
                <span className="font-mono">{l.availableQuantity}/{l.reorderLevel}</span>
              </li>
            ))}
            {!low.length && <li className="text-neutral-500">No low stock items 🎉</li>}
          </ul>
        </div>
        <div className="rounded border border-neutral-200 bg-white p-4">
          <h3 className="mb-3 text-xs font-semibold text-neutral-700">Warehouse Low Stock Share</h3>
          <Chart type="pie" data={byWh.map(w => ({ name: w.warehouseName, value: w.lowStockCount }))} valueKey="value" nameKey="name" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: number | string; tone?: 'good' | 'warn' | 'bad' }) {
  const color = tone === 'good' ? 'text-emerald-600' : tone === 'warn' ? 'text-amber-600' : tone === 'bad' ? 'text-red-600' : 'text-neutral-900';
  return (
    <div className="rounded border border-neutral-200 bg-white p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}
