import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { harmony } from '../lib/colorsystem';

const LABELS: Record<string, string> = {
  complementary: 'Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  monochrome: 'Monochrome',
};

export default function HarmonyPage() {
  const [hex, setHex] = useState('#FF006C');
  const result = harmony(hex);

  return (
    <ToolLayout title="Colour Harmony Generator" subtitle="Complementary, analogous, triadic and monochrome palettes from one colour — pure browser HSL math.">
      <div className="rounded-xl border border-subtle bg-subtle p-5">
        <label className="flex flex-col gap-1.5 max-w-xs">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Base colour</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={/^#[0-9a-f]{6}$/i.test(hex) ? hex : '#000000'}
              onChange={(e) => setHex(e.target.value)}
              className="h-11 w-11 rounded-lg border border-subtle bg-transparent"
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="min-h-[44px] flex-1 px-3 rounded-lg bg-default border border-subtle text-emphasis"
            />
          </div>
        </label>
        {!result && <p className="mt-3 text-sm text-spark">Enter a valid hex colour.</p>}
      </div>

      {result &&
        Object.entries(result).map(([key, colors]) => (
          <div key={key} className="rounded-xl border border-subtle bg-subtle p-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
              {LABELS[key]}
            </span>
            <div className="mt-3 flex flex-wrap gap-3">
              {colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="h-14 w-14 rounded-lg border border-subtle" style={{ background: c }} />
                  <span className="text-xs text-muted">{c}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
    </ToolLayout>
  );
}
