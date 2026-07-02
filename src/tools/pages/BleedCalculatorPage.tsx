import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { calculateBleed } from '../lib/bleed';

export default function BleedCalculatorPage() {
  const [trimWidthMm, setTrimWidthMm] = useState(100);
  const [trimHeightMm, setTrimHeightMm] = useState(100);
  const [bleedMm, setBleedMm] = useState(3);
  const [safeMarginMm, setSafeMarginMm] = useState(5);

  const result = calculateBleed({ trimWidthMm, trimHeightMm, bleedMm, safeMarginMm });

  const fields: { label: string; value: number; set: (n: number) => void }[] = [
    { label: 'Trim width (mm)', value: trimWidthMm, set: setTrimWidthMm },
    { label: 'Trim height (mm)', value: trimHeightMm, set: setTrimHeightMm },
    { label: 'Bleed (mm)', value: bleedMm, set: setBleedMm },
    { label: 'Safe margin (mm)', value: safeMarginMm, set: setSafeMarginMm },
  ];

  return (
    <ToolLayout
      title="Dieline/Bleed Calculator"
      subtitle="Trim, bleed and safe-area size for a packaging dieline, plus mm→px at print DPIs."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {fields.map((f) => (
          <label key={f.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">{f.label}</span>
            <input
              type="number"
              min={0}
              step="0.5"
              value={f.value}
              onChange={(e) => f.set(Math.max(0, Number(e.target.value)))}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Bleed size</span>
          <p className="mt-1 text-2xl font-extrabold text-emphasis">
            {result.bleedWidthMm} × {result.bleedHeightMm} mm
          </p>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Safe area</span>
          <p className="mt-1 text-2xl font-extrabold text-emphasis">
            {result.safeWidthMm} × {result.safeHeightMm} mm
          </p>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
            Bleed size in pixels
          </span>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.px.map((p) => (
              <div key={p.dpi} className="rounded-lg border border-subtle p-3">
                <p className="text-xs text-muted">{p.dpi} DPI</p>
                <p className="text-lg font-bold text-emphasis">
                  {p.width} × {p.height} px
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
