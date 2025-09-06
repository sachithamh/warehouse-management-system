import React from 'react';
import clsx from 'clsx';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string; // Tailwind width (default max-w-lg)
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, footer, widthClass = 'max-w-lg' }) => {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={clsx('relative w-full rounded-md bg-white shadow-lg', widthClass)}>
        <div className="flex items-start justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-neutral-800">{title}</h2>
          <button onClick={onClose} className="rounded p-1 text-neutral-500 hover:bg-neutral-100" aria-label="Close">×</button>
        </div>
        <div className="px-4 py-4 text-sm text-neutral-800">{children}</div>
        {footer && <div className="border-t px-4 py-3 bg-neutral-50">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
