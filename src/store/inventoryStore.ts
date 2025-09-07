import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { firestoreService } from '../lib/firebase/firestore';
import { InventoryItem } from '../lib/types/database';
import { computeAvailableQuantity } from '../lib/utils/inventoryCalculations';

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error?: string;
  fetchInventory: () => Promise<void>;
  getItem: (id: string) => InventoryItem | undefined;
  adjustStock: (id: string, delta: number) => Promise<void>;
  addItem: (data: Omit<InventoryItem, 'id' | 'updatedAt' | 'availableQuantity'>) => Promise<string>;
  updateItem: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  setItems: (items: InventoryItem[]) => void;
}

const COLLECTION = 'inventory';

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  loading: false,
  error: undefined,
  fetchInventory: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await firestoreService.list<InventoryItem>(COLLECTION);
      set({ items: data });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load inventory' });
    } finally {
      set({ loading: false });
    }
  },
  getItem: (id: string) => get().items.find((i) => i.id === id),
  adjustStock: async (id, delta) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    const updated = {
      quantity: newQuantity,
      availableQuantity: newQuantity - item.reservedQuantity,
      updatedAt: Timestamp.now(),
    } as Partial<InventoryItem>;
    await firestoreService.update<InventoryItem>(COLLECTION, id, updated);
    set({ items: get().items.map((i) => (i.id === id ? { ...i, ...updated } as InventoryItem : i)) });
  },
  addItem: async (data) => {
    const toCreate = {
      ...data,
      availableQuantity: computeAvailableQuantity({ quantity: data.quantity, reservedQuantity: data.reservedQuantity }),
      updatedAt: Timestamp.now(),
    } as any;
    const id = await firestoreService.create<InventoryItem>(COLLECTION, toCreate);
    await get().fetchInventory();
    return id;
  },
  updateItem: async (id, data) => {
    const patch = { ...data, updatedAt: Timestamp.now() } as Partial<InventoryItem>;
    await firestoreService.update<InventoryItem>(COLLECTION, id, patch);
    set({ items: get().items.map((i) => (i.id === id ? { ...i, ...patch } as InventoryItem : i)) });
  },
  removeItem: async (id) => {
    await firestoreService.remove(COLLECTION, id);
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  setItems: (items) => set({ items }),
}));
