"use client";
import React, { useState } from 'react';
import { useShops } from '../../lib/hooks/useShops';
import ShopForm from '../../components/forms/ShopForm/ShopForm';
import ShopCard from '../../components/features/shops/ShopCard';
import { useShopStore } from '../../store/shopStore';

export default function ShopsPage() {
  const { shops, loading, setSelected, selected } = useShops();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Shops</h1>
        <button onClick={()=> { setSelected(null); setShowModal(true); }} className="rounded bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800">New Shop</button>
      </div>
      {loading && !shops.length && <p className="text-xs text-neutral-500">Loading...</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shops.map(s => (
          <ShopCard key={s.id} shop={s} onEdit={(shop)=> { setSelected(shop); setShowModal(true); }} onSelect={()=> { /* future detail nav */ }} />
        ))}
        {!loading && !shops.length && <p className="text-xs text-neutral-500">No shops yet.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded bg-white p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">{selected ? 'Edit Shop' : 'Create Shop'}</h2>
              <button onClick={()=> setShowModal(false)} className="text-xs text-neutral-500 hover:text-neutral-800">✕</button>
            </div>
            <ShopForm initial={selected || undefined} onSuccess={()=> { setShowModal(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}
