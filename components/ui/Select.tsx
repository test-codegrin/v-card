'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Sort = 'newest' | 'oldest';

export default function SortSelect({
  value,
  onChange
}: {
  value: Sort;
  onChange: (v: Sort) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-44">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-black/10
          bg-white px-4 py-3 text-sm font-medium text-slate-800
          hover:border-[#9f2b34]/60
          focus:border-[#9f2b34] focus:ring-2 focus:ring-[#9f2b34]/30
          transition-all"
      >
        {value === 'newest' ? 'Newest first' : 'Oldest first'}
        <ChevronDown
          className={clsx(
            'h-4 w-4 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50  w-full rounded-xl border border-black/10
          bg-white shadow-xl overflow-hidden">
          
          {(['newest', 'oldest'] as Sort[]).map((item) => (
            <button
              key={item}
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={clsx(
                'w-full px-4 py-2.5 text-left text-sm transition-colors',
                value === item
                  ? 'bg-[#9f2b34]/10 text-[#9f2b34] font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              {item === 'newest' ? 'Newest first' : 'Oldest first'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
