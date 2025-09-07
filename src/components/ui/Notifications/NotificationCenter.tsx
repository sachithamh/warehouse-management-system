"use client";
import React, { useEffect } from 'react';
import { useNotificationStore } from '../../../store/notificationStore';

export default function NotificationCenter() {
  const { notifications, remove } = useNotificationStore();

  useEffect(() => {
    const timers = notifications.map(n => setTimeout(() => remove(n.id), 6000));
    return () => { timers.forEach(t => clearTimeout(t)); };
  }, [notifications, remove]);

  return (
    <div className="pointer-events-none fixed top-16 right-4 z-50 flex w-72 flex-col gap-2">
      {notifications.map(n => (
        <div key={n.id} className={`pointer-events-auto rounded border px-3 py-2 shadow bg-white border-neutral-200 text-neutral-800 text-xs ${n.type==='warning' ? 'border-amber-400 bg-amber-50' : ''} ${n.type==='error' ? 'border-red-400 bg-red-50' : ''} ${n.type==='success' ? 'border-emerald-400 bg-emerald-50' : ''}`}>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="font-medium leading-tight">{n.title}</p>
              {n.message && <p className="mt-0.5 text-[11px] leading-snug text-neutral-600">{n.message}</p>}
            </div>
            <button onClick={() => remove(n.id)} className="ml-1 text-[10px] text-neutral-400 hover:text-neutral-700">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}
