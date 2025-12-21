'use client';

import clsx from 'clsx';
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, ...props },
  ref
) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-black">
      {label && <span>{label}</span>}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
          error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {hint && !error && <span className="text-xs text-gray-500">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
});

export default Input;
