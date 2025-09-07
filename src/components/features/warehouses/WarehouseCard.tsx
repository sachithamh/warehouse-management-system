"use client";
import React from 'react';
import { Warehouse } from '../../../lib/types/database';

interface Props {
  warehouse: Warehouse;
  onSelect?: (w: Warehouse) => void;
  onEdit?: (w: Warehouse) => void;
  onDelete?: (w: Warehouse) => void;
}

export const WarehouseCard: React.FC<Props> = ({ warehouse, onSelect, onEdit, onDelete }) => {
  const usedPct = ((warehouse.capacity.usedSpace / warehouse.capacity.totalSpace) * 100).toFixed(1);
  return (
    <div className="rounded border border-neutral-200 bg-white p-4 shadow-sm hover:shadow transition cursor-pointer" onClick={() => onSelect?.(warehouse)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">{warehouse.name}</h3>
          <p className="mt-1 text-xs text-neutral-500">{warehouse.address.city}, {warehouse.address.country}</p>
        </div>
        <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${warehouse.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'}`}>{warehouse.isActive ? 'Active' : 'Inactive'}</span>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[11px] text-neutral-600">
          <span>Capacity</span>
          <span>{usedPct}% used</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded bg-neutral-100">
          <div className="h-full bg-neutral-900" style={{ width: `${usedPct}%` }} />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(warehouse); }}
            className="rounded bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700 hover:bg-neutral-200"
          >Edit</button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(warehouse); }}
            className="rounded bg-red-100 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-200"
          >Delete</button>
        )}
      </div>
    </div>
  );
};

export default WarehouseCard;
