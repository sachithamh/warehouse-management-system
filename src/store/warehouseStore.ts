import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { firestoreService } from '../lib/firebase/firestore';
import { Warehouse } from '../lib/types/database';

interface WarehouseState {
  warehouses: Warehouse[];
  loading: boolean;
  error?: string;
  selected?: Warehouse | null;
  fetchWarehouses: () => Promise<void>;
  getWarehouse: (id: string) => Warehouse | undefined;
  addWarehouse: (data: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateWarehouse: (id: string, data: Partial<Warehouse>) => Promise<void>;
  removeWarehouse: (id: string) => Promise<void>;
  setSelected: (w?: Warehouse | null) => void;
}

const COLLECTION = 'warehouses';

export const useWarehouseStore = create<WarehouseState>((set, get) => ({
  warehouses: [],
  loading: false,
  error: undefined,
  selected: undefined,
  fetchWarehouses: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await firestoreService.list<Warehouse>(COLLECTION);
      set({ warehouses: data });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load warehouses' });
    } finally {
      set({ loading: false });
    }
  },
  getWarehouse: (id: string) => get().warehouses.find((w) => w.id === id),
  addWarehouse: async (data) => {
    const now = Timestamp.now();
    const id = await firestoreService.create<Warehouse>(COLLECTION, {
      ...data,
      createdAt: now,
      updatedAt: now,
    } as any);
    // naive refresh; later optimize with optimistic update
    await get().fetchWarehouses();
    return id;
  },
  updateWarehouse: async (id, data) => {
    try {
      await firestoreService.update<Warehouse>(COLLECTION, id, { ...data, updatedAt: Timestamp.now() });
      await get().fetchWarehouses();
    } catch (e: any) {
      set({ error: e?.message || 'Update failed' });
    }
  },
  removeWarehouse: async (id) => {
    try {
      await firestoreService.remove(COLLECTION, id);
      set({ warehouses: get().warehouses.filter((w) => w.id !== id) });
    } catch (e: any) {
      set({ error: e?.message || 'Delete failed' });
    }
  },
  setSelected: (w) => set({ selected: w }),
}));
