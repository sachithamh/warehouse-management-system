"use client";
import { useEffect } from 'react';
import { useProductStore } from './../../store/productStore';

export function useProducts() {
  const { products, fetchProducts } = useProductStore();
  useEffect(() => {
    if (!products.length) fetchProducts();
  }, [products.length, fetchProducts]);
  return useProductStore();
}
