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

// Premium button styling keeps intent-specific colors while adding motion + focus clarity.
const baseStyles =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white shadow-card-hover hover:-translate-y-[1px] hover:shadow-card-hover',
  secondary: 'bg-white text-secondary shadow-soft hover:-translate-y-[1px] hover:shadow-card-hover',
  ghost: 'border border-white/15 bg-white/5 text-white hover:-translate-y-[1px] hover:border-white/25 hover:bg-white/10',
  light: 'border border-surface-200 bg-white text-primary hover:-translate-y-[1px] hover:bg-primary/5'
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
      <span className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition duration-500 group-hover:opacity-100" />
      {loading && <span className="relative mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      <span className="relative">{children}</span>
    </button>
  );
}
