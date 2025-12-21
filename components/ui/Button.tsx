'use client';

import clsx from 'clsx';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light';
type Size = 'md' | 'sm';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary/90 focus-visible:outline-primary shadow-soft',
  secondary: 'bg-white text-black hover:bg-white/90 focus-visible:outline-white',
  ghost: 'bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white',
  // Light variant for use on white backgrounds.
  light: 'border border-gray-200 bg-white text-primary hover:bg-primary/10 focus-visible:outline-primary'
};

const sizes: Record<Size, string> = {
  md: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-xs'
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={clsx(baseStyles, variants[variant], sizes[size], className)} aria-busy={loading} {...props}>
      {loading && <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}
