"use client";
import React from 'react';
import { useAuth } from '../../../lib/hooks/useAuth';
import { useAuthStore } from '../../../store/authStore';
import Link from 'next/link';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { signOut } = useAuthStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="font-semibold text-neutral-800">WMS</Link>
        <nav className="hidden md:flex items-center gap-3 text-sm text-neutral-600">
          <Link href="/inventory" className="hover:text-neutral-900">Inventory</Link>
          <Link href="/orders" className="hover:text-neutral-900">Orders</Link>
          <Link href="/deliveries" className="hover:text-neutral-900">Deliveries</Link>
          <Link href="/billing" className="hover:text-neutral-900">Billing</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3 text-sm">
        {user && <span className="text-neutral-700 hidden sm:inline">{user.email}</span>}
        {user && (
          <button
            onClick={() => signOut()}
            className="rounded bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
