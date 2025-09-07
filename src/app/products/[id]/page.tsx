"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '../../../lib/hooks/useProducts';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { getProduct, loading } = useProducts();
  const product = getProduct(params.id);
  const router = useRouter();

  if (loading && !product) return <div className="p-6 text-sm text-neutral-500">Loading...</div>;
  if (!product) return <div className="p-6 text-sm text-neutral-500">Product not found.</div>;

  return (
    <div className="p-6 space-y-4">
      <button onClick={() => router.back()} className="text-xs text-neutral-500 hover:text-neutral-800">← Back</button>
      <h1 className="text-lg font-semibold text-neutral-900">{product.name}</h1>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><span className="font-medium">SKU:</span> {product.sku}</p>
          <p><span className="font-medium">Category:</span> {product.category}</p>
          <p><span className="font-medium">Brand:</span> {product.brand}</p>
          <p><span className="font-medium">Active:</span> {product.isActive ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <p><span className="font-medium">Base Price:</span> {product.basePrice}</p>
          <p><span className="font-medium">Min Order Qty:</span> {product.minOrderQuantity}</p>
          <p><span className="font-medium">Dimensions:</span> {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height}</p>
          <p><span className="font-medium">Weight:</span> {product.dimensions.weight}</p>
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold text-neutral-800">Description</h2>
        <p className="mt-1 text-sm text-neutral-600 whitespace-pre-line">{product.description}</p>
      </div>
    </div>
  );
}
