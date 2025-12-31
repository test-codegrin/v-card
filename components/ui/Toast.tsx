'use client';

import clsx from 'clsx';

type ToastVariant = 'success' | 'error' | 'info';

type ToastProps = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
};

/*  DARK NAVBAR + WINE TOAST */
const variantStyles: Record<ToastVariant, string> = {
  success:
    'border-[#9f2b34] bg-[#1a1a1a] text-white',
  info:
    'border-[#9f2b34]/80 bg-[#111111] text-white',
  error:
    'border-red-500 bg-[#1a1a1a] text-white'
};

export function Toast({
  title,
  message,
  variant = 'info',
  onDismiss
}: ToastProps) {
  return (
    <div
      className={clsx(
        'hidden sm:block',
        'relative rounded-xl border px-4 py-3',
        'shadow-lg',
        variantStyles[variant]
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Indicator */}
        <span
          className={clsx(
            'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
            variant === 'error'
              ? 'bg-red-500'
              : 'bg-[#9f2b34]'
          )}
          aria-hidden
        />

        <div className="flex-1">
          {title && (
            <p className="text-sm font-semibold leading-tight">
              {title}
            </p>
          )}
          <p className="mt-0.5 text-sm leading-relaxed text-white/90">
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-xs font-semibold text-white/70
              transition hover:text-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#9f2b34]
              focus-visible:ring-offset-2
              focus-visible:ring-offset-black"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;
