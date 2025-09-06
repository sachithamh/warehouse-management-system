import React from 'react';
import { authService } from '../../../lib/firebase/auth';
import { useAuth } from '../../../lib/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '../../../lib/firebase/config';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    await authService.signUp(email, password, { name });
    const currentUser = auth.currentUser;
    if (currentUser) {
      document.cookie = `wms_uid=${currentUser.uid}; path=/; max-age=604800`;
      router.replace('/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '4rem auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Register</h1>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        <input name="name" placeholder="Full Name" required style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
        <input name="email" type="email" placeholder="Email" required style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
        <input name="password" type="password" placeholder="Password" required style={{ padding: 8, border: '1px solid #ccc', borderRadius: 4 }} />
        <button disabled={loading} style={{ padding: '10px 14px', background: '#111', color: '#fff', borderRadius: 4 }}>
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: 14 }}>
        Have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
