import React from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonColor = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const base = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm px-4 h-9';

const variantStyles: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-400',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-300',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400',
  },
  outline: {
    primary: 'border border-neutral-300 text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-400',
    secondary: 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50 focus-visible:ring-neutral-300',
    danger: 'border border-red-500 text-red-600 hover:bg-red-50 focus-visible:ring-red-400',
  },
  ghost: {
    primary: 'text-neutral-900 hover:bg-neutral-100',
    secondary: 'text-neutral-600 hover:bg-neutral-100',
    danger: 'text-red-600 hover:bg-red-50',
  },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  color = 'primary',
  className,
  loading,
  leftIcon,
  rightIcon,
  children,
  ...rest
}) => {
  return (
    <button
      className={clsx(base, variantStyles[variant][color], className)}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {leftIcon && <span className="mr-2 flex items-center" aria-hidden>{leftIcon}</span>}
      <span>{loading ? '...' : children}</span>
      {rightIcon && <span className="ml-2 flex items-center" aria-hidden>{rightIcon}</span>}
    </button>
  );
};

export default Button;
