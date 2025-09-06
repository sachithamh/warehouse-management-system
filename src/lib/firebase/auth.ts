import { auth } from './config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
} from 'firebase/auth';
import { db } from './config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { UserRole } from '../types/database';

// Ensure a corresponding Firestore user document exists (id == auth.uid)
export const ensureUserDocument = async (
  cred: UserCredential,
  extra?: { name?: string; role?: UserRole }
) => {
  const ref = doc(db, 'users', cred.user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: cred.user.email || '',
      name: extra?.name || cred.user.displayName || 'New User',
      role: extra?.role || 'shop_owner',
      phone: '',
      address: '',
      isActive: true,
      permissions: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

export const authService = {
  signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
  signUp: async (email: string, password: string, opts?: { name?: string; role?: UserRole }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await ensureUserDocument(cred, { name: opts?.name, role: opts?.role });
    return cred;
  },
  signOut: () => signOut(auth),
  subscribe: (cb: (user: FirebaseUser | null) => void) => onAuthStateChanged(auth, cb),
};

// NOTE: React hook logic removed from this module to keep it server-safe.
// Use the dedicated hook in `lib/hooks/useAuth.ts` for client components.
