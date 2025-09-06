"use client";
import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useAuth } from '../../../lib/hooks/useAuth';
import Link from 'next/link';
import { auth } from '../../../lib/firebase/config';

export default function LoginPage() {
  const { signIn, error, loading } = useAuthStore();
  useAuth(); // sync listener

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    await signIn(email, password);
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Basic placeholder cookie; in production replace with a secure httpOnly session via server verification
      document.cookie = `wms_uid=${currentUser.uid}; path=/; max-age=604800`;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect') || '/dashboard';
        window.location.replace(redirectTo);
      }
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '4rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Login</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        <input name="email" type="email" placeholder="Email" required style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
        <input name="password" type="password" placeholder="Password" required style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
        {error && <p style={{ color: 'red', fontSize: 12 }}>{error}</p>}
        <button disabled={loading} style={{ padding: '10px 14px', background: '#111', color: '#fff', borderRadius: 4 }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        No account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
