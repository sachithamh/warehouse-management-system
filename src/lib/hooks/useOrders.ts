"use client";
import { useEffect } from 'react';
import { useOrderStore } from '../../store/orderStore';

export function useOrders() {
  const { orders, fetchOrders } = useOrderStore();
  useEffect(()=> { if (!orders.length) fetchOrders(); }, [orders.length, fetchOrders]);
  return useOrderStore();
}
