'use client';

import clsx from 'clsx';

type ToastVariant = 'success' | 'error' | 'info';

type ToastProps = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
};

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-green-300/60 bg-green-50/95 text-green-900',
  error: 'border-red-300/70 bg-red-50/95 text-red-900',
  info: 'border-white/20 bg-white/10 text-white'
};

// Reusable toast surface so both the provider and future pages share the same visual language.
export function Toast({ title, message, variant = 'info', onDismiss }: ToastProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl border px-4 py-3 shadow-card-hover backdrop-blur',
        variantStyles[variant]
      )}
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/0 to-white/5 opacity-70" />
      <div className="relative flex items-start gap-3">
        <div className="mt-1 h-2 w-2 rounded-full bg-current" aria-hidden />
        <div className="flex-1">
          {title && <p className="text-sm font-semibold">{title}</p>}
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs font-semibold text-current transition hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
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
