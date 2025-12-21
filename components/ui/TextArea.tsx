'use client';

import clsx from 'clsx';
import React, { useId } from 'react';

type Tone = 'light' | 'dark';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
  tone?: Tone;
};

// Matches Input styling for consistent form rhythm across steps/sections.
const TextArea = React.forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { label, error, hint, className, tone = 'light', id, ...props },
  ref
) {
  const generatedId = useId();
  const textAreaId = id || generatedId;

  const toneClasses: Record<Tone, string> = {
    light: 'border-surface-200 bg-white/90 text-secondary placeholder:text-surface-400 focus:border-primary/70 focus:bg-white shadow-soft',
    dark: 'border-white/10 bg-white/5 text-white placeholder:text-white/60 focus:border-primary/60 focus:bg-white/10'
  };

  return (
    <div className={clsx('w-full space-y-1 text-sm font-medium', tone === 'dark' ? 'text-white/80' : 'text-secondary/80')}>
      <div
        className={clsx(
          'relative rounded-xl border px-4 pb-3 pt-5 transition focus-within:-translate-y-[1px] focus-within:shadow-card-hover',
          toneClasses[tone],
          error && 'border-red-400/80 focus-within:border-red-400 focus-within:shadow-none',
          className
        )}
      >
        {label && (
          <label
            htmlFor={textAreaId}
            className={clsx(
              'pointer-events-none absolute left-4 top-2 text-xs font-semibold uppercase tracking-wide',
              tone === 'dark' ? 'text-white/70' : 'text-surface-500'
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={textAreaId}
          ref={ref}
          className={clsx(
            'peer w-full bg-transparent text-sm font-semibold outline-none placeholder:text-transparent focus:outline-none',
            tone === 'dark' ? 'text-white' : 'text-secondary'
          )}
          placeholder={props.placeholder ?? ' '}
          {...props}
        />
      </div>
      {hint && !error && <span className={clsx('text-xs', tone === 'dark' ? 'text-white/60' : 'text-surface-500')}>{hint}</span>}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
});

export default TextArea;
