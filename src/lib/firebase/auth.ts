import { auth } from './config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

export const authService = {
  signIn: (email: string, password: string) => signInWithEmailAndPassword(auth, email, password),
  signUp: (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password),
  signOut: () => signOut(auth),
  subscribe: (cb: (user: FirebaseUser | null) => void) => onAuthStateChanged(auth, cb),
};

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = authService.subscribe((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, loading };
};
