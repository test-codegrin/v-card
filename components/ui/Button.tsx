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
  'group relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f2b34] focus-visible:ring-offset-2 focus-visible:ring-offset-white ' +
  'disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white shadow-md hover:bg-white hover:text-black hover:shadow-lg',

  secondary:
    'bg-black text-white shadow-sm hover:-translate-y-[1px] hover:shadow-md',

  ghost:
    'border border-black/10 bg-white text-black hover:bg-primary hover:text-white',

  light:
    'border border-[#9f2b34]/30 bg-white text-[#9f2b34] hover:bg-[#9f2b34]/5 hover:-translate-y-[1px]'
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
  const spinnerColor =
    variant === 'primary' || variant === 'secondary'
      ? 'border-white/40 border-t-white'
      : 'border-black/30 border-t-black';

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      aria-busy={loading}
      disabled={loading || props.disabled}
      {...props}
    >
      {/* Hover overlay */}
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-black/5 opacity-0 transition group-hover:opacity-100" />

      {loading && (
        <span
          className={clsx(
            'relative mr-2 h-3 w-3 animate-spin rounded-full border-2',
            spinnerColor
          )}
        />
      )}

      <span className="relative">{children}</span>
    </button>
  );
}
