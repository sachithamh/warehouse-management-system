import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';
import { firestoreService } from '../lib/firebase/firestore';
import { Product, ProductDimensions } from '../lib/types/database';

interface ProductState {
  products: Product[];
  loading: boolean;
  error?: string;
  selected?: Product | null;
  fetchProducts: () => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  setSelected: (p?: Product | null) => void;
}

const COLLECTION = 'products';

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: undefined,
  selected: undefined,
  fetchProducts: async () => {
    set({ loading: true, error: undefined });
    try {
      const data = await firestoreService.list<Product>(COLLECTION);
      set({ products: data });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to load products' });
    } finally {
      set({ loading: false });
    }
  },
  getProduct: (id: string) => get().products.find((p) => p.id === id),
  addProduct: async (data) => {
    const now = Timestamp.now();
    const id = await firestoreService.create<Product>(COLLECTION, {
      ...data,
      createdAt: now,
      updatedAt: now,
    } as any);
    await get().fetchProducts();
    return id;
  },
  updateProduct: async (id, data) => {
    try {
      await firestoreService.update<Product>(COLLECTION, id, { ...data, updatedAt: Timestamp.now() });
      await get().fetchProducts();
    } catch (e: any) {
      set({ error: e?.message || 'Update failed' });
    }
  },
  removeProduct: async (id) => {
    try {
      await firestoreService.remove(COLLECTION, id);
      set({ products: get().products.filter((p) => p.id !== id) });
    } catch (e: any) {
      set({ error: e?.message || 'Delete failed' });
    }
  },
  setSelected: (p) => set({ selected: p }),
}));
