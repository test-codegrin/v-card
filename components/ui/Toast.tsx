'use client';

import clsx from 'clsx';

type ToastVariant = 'success' | 'error' | 'info';

type ToastProps = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
};

/* -------------------------------------------
   WINE THEME TOAST STYLES
------------------------------------------- */
const variantStyles: Record<ToastVariant, string> = {
  success:
    'border-[#9f2b34]/40 bg-[#9f2b34]/10 text-[#7a1f27]',
  error:
    'border-[#7a1f27]/60 bg-[#7a1f27]/15 text-[#5a141b]',
  info:
    'border-[#9f2b34]/30 bg-[#9f2b34]/08 text-[#9f2b34]'
};

// Reusable toast surface aligned with wine theme
export function Toast({
  title,
  message,
  variant = 'info',
  onDismiss
}: ToastProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl border px-4 py-3',
        'shadow-[0_10px_30px_-12px_rgba(159,43,52,0.35)]',
        'backdrop-blur-md',
        variantStyles[variant]
      )}
      role="status"
      aria-live="polite"
    >
      {/* subtle glass highlight */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-60" />

      <div className="relative flex items-start gap-3">
        {/* indicator dot */}
        <div
          className="mt-1 h-2.5 w-2.5 rounded-full bg-current"
          aria-hidden
        />

        <div className="flex-1">
          {title && (
            <p className="text-sm font-semibold leading-none">
              {title}
            </p>
          )}
          <p className="mt-0.5 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs font-semibold text-current transition
              hover:scale-110
              focus-visible:outline-none
              focus-visible:ring-1
              focus-visible:ring-current
              focus-visible:ring-offset-2
              focus-visible:ring-offset-white"
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
