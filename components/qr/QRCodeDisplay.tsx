'use client';

import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  value: string;
  label?: string;
};

export default function QRCodeDisplay({ value, label }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="overflow-hidden rounded-xl bg-white p-4 shadow-soft">
        <QRCodeCanvas value={value} size={164} fgColor="#0B0F19" bgColor="#FFFFFF" />
      </div>
      {label && <span className="text-sm text-white/70">{label}</span>}
    </div>
  );
}
