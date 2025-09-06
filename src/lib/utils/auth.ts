import { redirect } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

// Client hook to guard pages (simple version; for server components you'd verify session differently)
export const useProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (!loading && !user) {
    // In client component we can't call redirect directly inside render conditionally; caller should check.
    return { isAllowed: false };
  }
  return { isAllowed: !!user, loading };
};

// Server-side placeholder (future enhancement could integrate cookies / session tokens)
export const requireAuthServer = (user: any) => {
  if (!user) redirect('/login');
};
