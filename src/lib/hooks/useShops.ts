"use client";
import { useEffect } from 'react';
import { useShopStore } from '../../store/shopStore';

export function useShops() {
  const { shops, fetchShops } = useShopStore();
  useEffect(()=> { if (!shops.length) fetchShops(); }, [shops.length, fetchShops]);
  return useShopStore();
}
