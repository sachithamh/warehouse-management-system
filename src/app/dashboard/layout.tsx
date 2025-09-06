import React from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';

// Client wrapper to ensure dashboard subtree is only rendered when authenticated.
// (Early-phase client-side guard; middleware adds baseline protection.)
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-sm text-neutral-600">Loading session...</div>;
  if (!user) redirect('/login');
  return <>{children}</>;
}
