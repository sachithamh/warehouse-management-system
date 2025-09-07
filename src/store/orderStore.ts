import { create } from 'zustand';
import { firestoreService } from '../lib/firebase/firestore';
import { Order, OrderItem, OrderStatus } from '../lib/types/database';
import { Timestamp } from 'firebase/firestore';
import { computeOrderItemsTotals, computeTotals, generateOrderNumber } from '../lib/utils/orderCalculations';

interface CreateOrderInput {
  shopId: string;
  warehouseId: string;
  items: { productId: string; quantity: number; unitPrice: number; discount?: number }[];
  requestedDeliveryDate: Timestamp;
  notes?: string;
  taxRate?: number;
  shippingCost?: number;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error?: string;
  fetchOrders: () => Promise<void>;
  getOrder: (id: string) => Order | undefined;
  createOrder: (input: CreateOrderInput) => Promise<string>;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
}

const COLLECTION = 'orders';

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  loading: false,
  error: undefined,
  fetchOrders: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await firestoreService.list<Order>(COLLECTION);
      set({ orders: data });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load orders' });
    } finally {
      set({ loading: false });
    }
  },
  getOrder: (id) => get().orders.find(o => o.id === id),
  createOrder: async (input) => {
    const now = Timestamp.now();
    // Build order items with calculated totalPrice
    const items: OrderItem[] = computeOrderItemsTotals(input.items) as any;
    const totals = computeTotals(items, input.taxRate || 0, input.shippingCost || 0);
    const order: Omit<Order,'id'> = {
      orderNumber: generateOrderNumber(),
      shopId: input.shopId,
      warehouseId: input.warehouseId,
      status: 'pending',
      items,
      totals: { ...totals, amountPaid: 0, amountDue: totals.grandTotal } as any,
      requestedDeliveryDate: input.requestedDeliveryDate,
      createdAt: now,
      updatedAt: now,
      notes: input.notes,
    };
    const id = await firestoreService.create<Order>(COLLECTION, order as any);
    await get().fetchOrders();
    // TODO: Reserve inventory quantities (Phase 5.3 or enhancement) by updating inventory reservedQuantity
    return id;
  },
  updateStatus: async (id, status) => {
    await firestoreService.update<Order>(COLLECTION, id, { status, updatedAt: Timestamp.now() });
    set({ orders: get().orders.map(o => o.id === id ? { ...o, status } : o) });
  },
  removeOrder: async (id) => {
    await firestoreService.remove(COLLECTION, id);
    set({ orders: get().orders.filter(o => o.id !== id) });
  }
}));
