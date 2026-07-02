import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { calculateDieline } from '../lib/dieline';

export default function DielinePage() {
  const [lengthMm, setLengthMm] = useState(100);
  const [widthMm, setWidthMm] = useState(60);
  const [heightMm, setHeightMm] = useState(40);

  const result = calculateDieline({ lengthMm, widthMm, heightMm });

  const fields: { label: string; value: number; set: (n: number) => void }[] = [
    { label: 'Length / L (mm)', value: lengthMm, set: setLengthMm },
    { label: 'Width / W (mm)', value: widthMm, set: setWidthMm },
    { label: 'Height / H (mm)', value: heightMm, set: setHeightMm },
  ];

  return (
    <ToolLayout
      title="Box Dieline Calculator"
      subtitle="Panel sizes, flat dieline spread and glue-flap suggestion for a straight-tuck carton — pure math estimate, verify with your die-maker before production."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {fields.map((f) => (
          <label key={f.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">{f.label}</span>
            <input
              type="number"
              min={1}
              value={f.value}
              onChange={(e) => f.set(Math.max(1, Number(e.target.value)))}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Flat dieline size</span>
          <p className="mt-1 text-2xl font-extrabold text-emphasis">
            {result.flatWidthMm} × {result.flatHeightMm} mm
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Front/back panel</p>
            <p className="text-lg font-bold text-emphasis">{result.panels.front} mm</p>
          </div>
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Side panel</p>
            <p className="text-lg font-bold text-emphasis">{result.panels.side} mm</p>
          </div>
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Glue flap</p>
            <p className="text-lg font-bold text-emphasis">{result.glueFlapMm} mm</p>
          </div>
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Top/bottom flap</p>
            <p className="text-lg font-bold text-emphasis">{result.topFlapMm} mm</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
