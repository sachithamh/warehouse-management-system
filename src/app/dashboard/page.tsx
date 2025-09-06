import React from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { signOut } = useAuthStore();

  React.useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading) return <p style={{ padding: 32 }}>Loading...</p>;
  if (!user) return null;

  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Dashboard</h1>
      <p style={{ marginTop: 8 }}>Welcome, {user.email}</p>
      <button
        onClick={() => signOut()}
        style={{ marginTop: 16, padding: '8px 14px', background: '#c00', color: '#fff', borderRadius: 4 }}
      >
        Sign Out
      </button>
    </div>
  );
}
