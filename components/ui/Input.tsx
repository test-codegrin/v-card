'use client';

import clsx from 'clsx';
import React, { useId } from 'react';

type Tone = 'light' | 'dark';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  tone?: Tone;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, tone = 'light', id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const toneClasses: Record<Tone, string> = {
    light:
      'border-black/10 bg-white text-black placeholder:text-gray-400 ' +
      'hover:border-[#9f2b34]/50 ' +
      'focus:border-[#9f2b34] focus:bg-white shadow-sm',
    dark:
      'border-white/20 bg-black/40 text-white placeholder:text-white/50 ' +
      'hover:border-[#9f2b34]/60 focus:border-[#9f2b34]'
  };

  return (
    <div
      className={clsx(
        'w-full space-y-1 text-sm font-medium',
        tone === 'dark' ? 'text-white/80' : 'text-gray-700'
      )}
    >
      <div
        className={clsx(
          'relative rounded-xl border px-4 pb-2 pt-5 transition-all',
          'focus-within:-translate-y-[1px] focus-within:shadow-md',
          toneClasses[tone],
          error &&
            'border-red-400 focus-within:border-red-400 focus-within:shadow-none',
          className
        )}
      >
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'pointer-events-none absolute left-4 top-2 text-xs font-semibold uppercase tracking-wide transition',
              tone === 'dark' ? 'text-white/70' : 'text-gray-500'
            )}
          >
            {label}
          </label>
        )}

     <input
  id={inputId}
  ref={ref}
  className={clsx(
    'peer w-full bg-transparent text-sm font-semibold outline-none',
    'placeholder:text-gray-400 focus:outline-none',
    tone === 'dark' ? 'text-white' : 'text-black'
  )}
  placeholder={props.placeholder}
  {...props}
/>
      </div>

      {hint && !error && (
        <span
          className={clsx(
            'text-xs',
            tone === 'dark' ? 'text-white/60' : 'text-gray-500'
          )}
        >
          {hint}
        </span>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Input;
