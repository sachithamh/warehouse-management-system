"use client";
import React from 'react';
import { Shop } from '../../../lib/types/database';

interface Props {
  shop: Shop;
  onSelect?: (shop: Shop) => void;
  onEdit?: (shop: Shop) => void;
}

export default function ShopCard({ shop, onSelect, onEdit }: Props) {
  return (
    <div className="rounded border border-neutral-200 bg-white p-4 text-xs shadow-sm hover:shadow transition cursor-pointer" onClick={()=> onSelect?.(shop)}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-neutral-800 truncate" title={shop.name}>{shop.name}</h3>
        <button onClick={(e)=> {e.stopPropagation(); onEdit?.(shop);} } className="text-[10px] text-neutral-500 hover:text-neutral-800">Edit</button>
      </div>
      <p className="text-neutral-600 truncate">Owner: {shop.ownerName}</p>
      <p className="text-neutral-600 truncate">Email: {shop.email}</p>
      <p className="text-neutral-600 truncate">Phone: {shop.phone}</p>
      <p className="mt-2 inline-block rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-neutral-600">{shop.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}
