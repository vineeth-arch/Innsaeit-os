import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { shadeRamp } from '../lib/colorsystem';

export default function ShadesPage() {
  const [hex, setHex] = useState('#2C0098');
  const ramp = shadeRamp(hex);
  const [copied, setCopied] = useState('');

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied((c) => (c === value ? '' : c)), 1200);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <ToolLayout title="Tint & Shade Generator" subtitle="Tailwind-style 50–950 lightness ramp from one brand colour — pure browser HSL math.">
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
        {!ramp && <p className="mt-3 text-sm text-spark">Enter a valid hex colour.</p>}
      </div>

      {ramp && (
        <div className="rounded-xl border border-subtle bg-subtle p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {ramp.map((s) => (
              <button
                key={s.step}
                onClick={() => copy(s.hex)}
                className="flex flex-col items-center gap-1 rounded-lg overflow-hidden border border-subtle"
              >
                <div className="h-14 w-full" style={{ background: s.hex }} />
                <div className="pb-2 text-center">
                  <p className="text-xs font-bold text-emphasis">{s.step}</p>
                  <p className="text-[11px] text-muted">{copied === s.hex ? 'Copied ✓' : s.hex}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
