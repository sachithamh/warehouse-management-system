import React from 'react';

export interface LoadingProps {
  label?: string;
  full?: boolean;
  size?: number; // diameter px
}

export const Loading: React.FC<LoadingProps> = ({ label = 'Loading', full, size = 28 }) => {
  const spinner = (
    <svg
      className="animate-spin text-neutral-700"
      style={{ width: size, height: size }}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  if (full) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-3 text-sm text-neutral-600">
        {spinner}
        <span>{label}</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 text-neutral-600 text-sm">{spinner}<span>{label}</span></div>
  );
};

export default Loading;
