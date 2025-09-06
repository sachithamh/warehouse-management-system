import { useEffect } from 'react';
import { authService } from '../firebase/auth';
import { useAuthStore } from '../../store/authStore';

// Consolidated auth hook that syncs Firebase auth state into the Zustand store
export const useAuth = () => {
  const { user, setUser, loading, setLoading, error } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsub = authService.subscribe((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [setUser, setLoading]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };
};
