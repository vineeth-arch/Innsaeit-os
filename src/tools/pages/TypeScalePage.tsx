import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { modularScale, fluidClamp, RATIOS } from '../lib/typescale';

export default function TypeScalePage() {
  const [basePx, setBasePx] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [minPx, setMinPx] = useState(16);
  const [maxPx, setMaxPx] = useState(24);
  const [minViewportPx, setMinViewportPx] = useState(375);
  const [maxViewportPx, setMaxViewportPx] = useState(1440);

  const scale = modularScale(basePx, ratio);
  const clamp = fluidClamp({ minPx, maxPx, minViewportPx, maxViewportPx });

  return (
    <ToolLayout title="Type Scale / Fluid Clamp" subtitle="Modular type scale and a CSS clamp() fluid size — pure browser math.">
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Modular scale</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Base size (px)</span>
            <input
              type="number"
              value={basePx}
              onChange={(e) => setBasePx(Number(e.target.value))}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Ratio</span>
            <select
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            >
              {RATIOS.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-col gap-2">
          {scale.map((s) => (
            <div key={s.step} className="flex items-baseline gap-3 border-b border-subtle pb-2 last:border-0">
              <span className="w-10 text-xs text-muted">{s.step >= 0 ? `+${s.step}` : s.step}</span>
              <span className="w-24 text-xs text-muted">{s.px}px / {s.rem}rem</span>
              <span className="text-emphasis font-bold" style={{ fontSize: `${Math.min(s.px, 64)}px` }}>
                Aa
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Fluid clamp()</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Min px</span>
            <input type="number" value={minPx} onChange={(e) => setMinPx(Number(e.target.value))} className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Max px</span>
            <input type="number" value={maxPx} onChange={(e) => setMaxPx(Number(e.target.value))} className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Min viewport</span>
            <input type="number" value={minViewportPx} onChange={(e) => setMinViewportPx(Number(e.target.value))} className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Max viewport</span>
            <input type="number" value={maxViewportPx} onChange={(e) => setMaxViewportPx(Number(e.target.value))} className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis" />
          </label>
        </div>
        <code className="rounded-lg bg-default border border-subtle p-3 text-sm text-brand-default break-all">
          font-size: {clamp};
        </code>
      </div>
    </ToolLayout>
  );
}
