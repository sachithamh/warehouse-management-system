import { create } from 'zustand';

export interface AppNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message?: string;
  createdAt: number;
  read?: boolean;
}

interface NotificationState {
  notifications: AppNotification[];
  push: (n: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  markRead: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  push: (n) => set({ notifications: [{ id: crypto.randomUUID(), createdAt: Date.now(), ...n }, ...get().notifications].slice(0, 50) }),
  markRead: (id) => set({ notifications: get().notifications.map(n => n.id === id ? { ...n, read: true } : n) }),
  remove: (id) => set({ notifications: get().notifications.filter(n => n.id !== id) }),
  clear: () => set({ notifications: [] }),
}));
