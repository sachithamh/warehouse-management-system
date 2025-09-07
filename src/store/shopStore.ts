import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { firestoreService } from '../lib/firebase/firestore';
import { Shop } from '../lib/types/database';

interface ShopState {
  shops: Shop[];
  loading: boolean;
  error?: string;
  selected?: Shop | null;
  fetchShops: () => Promise<void>;
  getShop: (id: string) => Shop | undefined;
  addShop: (data: Omit<Shop, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateShop: (id: string, data: Partial<Shop>) => Promise<void>;
  removeShop: (id: string) => Promise<void>;
  setSelected: (s?: Shop | null) => void;
}

const COLLECTION = 'shops';

export const useShopStore = create<ShopState>((set, get) => ({
  shops: [],
  loading: false,
  error: undefined,
  selected: undefined,
  fetchShops: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await firestoreService.list<Shop>(COLLECTION);
      set({ shops: data });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load shops' });
    } finally {
      set({ loading: false });
    }
  },
  getShop: (id) => get().shops.find(s => s.id === id),
  addShop: async (data) => {
    const now = Timestamp.now();
    const id = await firestoreService.create<Shop>(COLLECTION, { ...data, createdAt: now, updatedAt: now } as any);
    await get().fetchShops();
    return id;
  },
  updateShop: async (id, data) => {
    try {
      await firestoreService.update<Shop>(COLLECTION, id, { ...data, updatedAt: Timestamp.now() });
      await get().fetchShops();
    } catch (e: any) {
      set({ error: e?.message || 'Update failed' });
    }
  },
  removeShop: async (id) => {
    try {
      await firestoreService.remove(COLLECTION, id);
      set({ shops: get().shops.filter(s => s.id !== id) });
    } catch (e: any) {
      set({ error: e?.message || 'Delete failed' });
    }
  },
  setSelected: (s) => set({ selected: s })
}));
