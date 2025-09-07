"use client";
import React from 'react';
import ProductForm from '../../../components/forms/ProductForm/ProductForm';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  return (
    <div className="p-6 max-w-2xl">
      <button onClick={() => router.back()} className="text-xs text-neutral-500 hover:text-neutral-800 mb-4">← Back</button>
      <h1 className="text-lg font-semibold text-neutral-900 mb-4">Add Product</h1>
      <ProductForm onSuccess={() => router.push('/products')} />
    </div>
  );
}
