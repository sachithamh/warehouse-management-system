import { create } from 'zustand';
import { authService } from '../lib/firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error?: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: undefined,
  signIn: async (email, password) => {
    set({ loading: true, error: undefined });
    try {
      await authService.signIn(email, password);
    } catch (e: any) {
      set({ error: e?.message || 'Authentication failed' });
    } finally {
      set({ loading: false });
    }
  },
  signOut: async () => {
    try {
      await authService.signOut();
    } finally {
      if (typeof document !== 'undefined') {
        document.cookie = 'wms_uid=; Max-Age=0; path=/';
      }
      set({ user: null });
    }
  },
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

