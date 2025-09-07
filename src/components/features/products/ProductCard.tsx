"use client";
import React from 'react';
import { Product } from '../../../lib/types/database';

interface Props {
  product: Product;
  onSelect?: (p: Product) => void;
  onEdit?: (p: Product) => void;
  onDelete?: (p: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onSelect, onEdit, onDelete }) => {
  return (
    <div
      className="rounded border border-neutral-200 bg-white p-4 shadow-sm hover:shadow transition cursor-pointer"
      onClick={() => onSelect?.(product)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">{product.name}</h3>
          <p className="mt-1 text-[11px] text-neutral-500">SKU: {product.sku}</p>
          <p className="mt-1 text-[11px] text-neutral-500">{product.category}</p>
        </div>
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-medium ${
            product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-600'
          }`}
        >
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(product); }}
            className="rounded bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-700 hover:bg-neutral-200"
          >Edit</button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(product); }}
            className="rounded bg-red-100 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-200"
          >Delete</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
