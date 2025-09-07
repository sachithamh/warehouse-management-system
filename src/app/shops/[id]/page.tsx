"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useShops } from '../../../lib/hooks/useShops';

export default function ShopDetailPage() {
  const params = useParams<{ id: string }>();
  const { getShop, loading } = useShops();
  const shop = getShop(params.id);
  const router = useRouter();

  if (loading && !shop) return <div className="p-6 text-xs text-neutral-500">Loading...</div>;
  if (!shop) return <div className="p-6 text-xs text-neutral-500">Shop not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => router.back()} className="text-xs text-neutral-500 hover:text-neutral-800">← Back</button>
      <h1 className="text-lg font-semibold text-neutral-900">Shop Detail</h1>
      <div className="grid gap-4 text-xs sm:grid-cols-2">
        <div>
          <p><span className="font-medium">Name:</span> {shop.name}</p>
          <p><span className="font-medium">Owner:</span> {shop.ownerName}</p>
          <p><span className="font-medium">Email:</span> {shop.email}</p>
          <p><span className="font-medium">Phone:</span> {shop.phone}</p>
          <p><span className="font-medium">License:</span> {shop.businessLicense}</p>
          <p><span className="font-medium">Tax ID:</span> {shop.taxId}</p>
        </div>
        <div>
          <p><span className="font-medium">Credit Limit:</span> {shop.creditLimit}</p>
          <p><span className="font-medium">Credit Used:</span> {shop.creditUsed}</p>
          <p><span className="font-medium">Payment Terms:</span> {shop.paymentTerms} days</p>
          <p><span className="font-medium">Preferred Days:</span> {shop.preferredDeliveryDays.join(', ') || '—'}</p>
          <p><span className="font-medium">Status:</span> {shop.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      </div>
      <div>
        <h2 className="mb-2 text-sm font-semibold text-neutral-800">Address</h2>
        <div className="rounded border border-neutral-200 bg-white p-3 text-xs">
          <p>{shop.address.street}</p>
          <p>{shop.address.city}, {shop.address.state} {shop.address.zipCode}</p>
          <p>{shop.address.country}</p>
        </div>
      </div>
    </div>
  );
}
