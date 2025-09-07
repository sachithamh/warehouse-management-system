"use client";
import React from 'react';
import { useProducts } from '../../lib/hooks/useProducts';
import ProductCard from '../../components/features/products/ProductCard';
import { useProductStore } from '../../store/productStore';
import ProductForm from '../../components/forms/ProductForm/ProductForm';

export default function ProductsPage() {
  const { products, loading, error, setSelected } = useProducts();
  const { removeProduct } = useProductStore();
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | undefined>(undefined);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Products</h1>
        <button
          onClick={() => { setEditingId(undefined); setShowForm(true); }}
          className="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >New Product</button>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {loading && <p className="mt-4 text-sm text-neutral-500">Loading products...</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {products.map((p: any) => (
          <ProductCard
            key={p.id}
            product={p}
            onSelect={(pr) => setSelected(pr)}
            onEdit={(pr) => { setEditingId(pr.id); setShowForm(true); }}
            onDelete={async (pr) => { if (confirm('Delete product?')) await removeProduct(pr.id); }}
          />
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded bg-white p-5 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-800">{editingId ? 'Edit Product' : 'Create Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-xs text-neutral-500 hover:text-neutral-800">✕</button>
            </div>
            <ProductForm
              productId={editingId}
              onSuccess={() => { setShowForm(false); setEditingId(undefined); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
