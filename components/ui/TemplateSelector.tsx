'use client';

import clsx from 'clsx';
import { CardTemplate } from '@/types/card';

type TemplateSelectorProps = {
  value: CardTemplate;
  onChange: (template: CardTemplate) => void;
};

const templates: { id: CardTemplate; name: string; description: string }[] = [
  { id: 'modern', name: 'Modern Minimal', description: 'Clean layout with gradients and soft glass.' },
  { id: 'classic', name: 'Classic Bold', description: 'Crisp card edges with clear hierarchy.' },
  { id: 'creative', name: 'Creative Layout', description: 'Offset panels with accent gradients.' }
];

// Template selector lets users switch between pre-styled previews before saving.
export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onChange(template.id)}
          className={clsx(
            'group relative overflow-hidden rounded-2xl border px-3 py-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary',
            value === template.id
              ? 'border-primary/70 bg-primary/5 shadow-card-hover'
              : 'border-white/10 bg-white/5 hover:-translate-y-[1px] hover:border-white/20'
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/0 opacity-0 transition group-hover:opacity-100" />
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{template.name}</p>
              {value === template.id && <span className="rounded-full bg-primary/20 px-1 py-1 text-[11px] font-semibold text-primary">Active</span>}
            </div>
            <p className="text-xs text-white/70">{template.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
