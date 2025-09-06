import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  description,
  className,
  leftIcon,
  rightIcon,
  id,
  ...rest
}) => {
  const inputId = id || rest.name || React.useId();
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <div className={clsx('flex items-center rounded-md border bg-white px-2', error ? 'border-red-500' : 'border-neutral-300 focus-within:border-neutral-500')}>
        {leftIcon && <span className="mr-2 text-neutral-500" aria-hidden>{leftIcon}</span>}
        <input
          id={inputId}
          className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-neutral-400"
          {...rest}
        />
        {rightIcon && <span className="ml-2 text-neutral-500" aria-hidden>{rightIcon}</span>}
      </div>
      {description && !error && <p className="text-xs text-neutral-500">{description}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
