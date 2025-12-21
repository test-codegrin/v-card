'use client';

import React from 'react';
import clsx from 'clsx';
import Button from './Button';

type ModalProps = {
  title?: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
};

// Lightweight modal used for confirmations and previews without altering business logic.
export default function Modal({ title, description, open, onClose, children, size = 'md', footer }: ModalProps) {
  if (!open) return null;

  const sizes: Record<typeof size, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur">
      <div className={clsx('panel relative w-full p-8 shadow-card-hover', sizes[size])}>
        <button
          className="absolute right-4 top-4 text-white/60 transition hover:scale-105 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
          aria-label="Close"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="space-y-3">
          {title && <h3 className="text-2xl font-semibold text-white">{title}</h3>}
          {description && <p className="text-sm text-white/70">{description}</p>}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">{children}</div>
        </div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
        {!footer && (
          <div className="mt-6 flex justify-end">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
