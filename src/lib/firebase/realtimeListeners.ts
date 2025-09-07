import { collection, onSnapshot, QueryConstraint, query } from 'firebase/firestore';
import { db } from './config';

export type UnsubscribeFn = () => void;

export function listenCollection<T = any>(path: string, cb: (items: T[]) => void, ...constraints: QueryConstraint[]): UnsubscribeFn {
  const colRef = collection(db, path);
  const q = constraints.length ? query(colRef, ...constraints) : colRef;
  const unsub = onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) })) as T[];
    cb(data);
  });
  return unsub;
}
