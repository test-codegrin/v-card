'use client';

import clsx from 'clsx';
import { CardTemplate } from '@/types/card';

type TemplateSelectorProps = {
  value: CardTemplate;
  onChange: (template: CardTemplate) => void;
};

const templates: { id: CardTemplate; name: string; description: string }[] = [
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean layout with subtle gradients and soft glass.'
  },
  {
    id: 'classic',
    name: 'Classic Bold',
    description: 'Structured layout with strong hierarchy.'
  },
  {
    id: 'creative',
    name: 'Creative Layout',
    description: 'Playful composition with accent highlights.'
  }
];

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {templates.map((template) => {
        const isActive = value === template.id;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            className={clsx(
              'group relative rounded-2xl border p-4 text-left transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f2b34] focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              isActive
                ? 'border-[#9f2b34] bg-[#9f2b34]/5 shadow-md'
                : 'border-black/10 bg-white hover:-translate-y-[1px] hover:border-black/20 hover:shadow-sm'
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-black">
                  {template.name}
                </p>

                {isActive && (
                  <span className="rounded-full bg-[#9f2b34] px-1 py-0.5 text-[11px] font-semibold text-white">
                    Active
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600">
                {template.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
