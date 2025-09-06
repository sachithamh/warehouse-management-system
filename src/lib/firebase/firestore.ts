import { db } from './config';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  QueryConstraint,
  query,
  DocumentData,
} from 'firebase/firestore';

export const firestoreService = {
  list: async <T>(path: string, ...constraints: QueryConstraint[]): Promise<T[]> => {
    const colRef = collection(db, path);
    const q = constraints.length ? query(colRef, ...constraints) : colRef;
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as object) })) as T[];
  },
  get: async <T>(path: string, id: string): Promise<T | null> => {
    const ref = doc(db, path, id);
    const snap = await getDoc(ref);
    return snap.exists() ? ({ id: snap.id, ...(snap.data() as object) } as T) : null;
  },
  create: async <T extends Record<string, any>>(path: string, data: Omit<T, 'id'>) => {
    const colRef = collection(db, path);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  },
  update: async <T extends Record<string, any>>(path: string, id: string, data: Partial<T>) => {
    const ref = doc(db, path, id);
    await updateDoc(ref, data as Partial<DocumentData>);
  },
  remove: async (path: string, id: string) => {
    const ref = doc(db, path, id);
    await deleteDoc(ref);
  },
};
