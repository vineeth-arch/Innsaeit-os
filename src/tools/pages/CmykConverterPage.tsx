import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { rgbToCmyk, cmykToRgb, rgbToHex, hexToRgb, type Cmyk } from '../lib/cmyk';

function clamp100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function CmykConverterPage() {
  const [hex, setHex] = useState('#FF006C');
  const rgb = hexToRgb(hex);
  const cmyk = rgb ? rgbToCmyk(rgb) : null;

  function setFromCmyk(next: Cmyk) {
    const nextRgb = cmykToRgb(next);
    setHex(rgbToHex(nextRgb));
  }

  return (
    <ToolLayout
      title="CMYK ↔ RGB Converter"
      subtitle="Convert colour values between CMYK (print) and RGB/HEX (screen) — pure browser math."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">HEX / RGB</span>
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

        {!rgb && <p className="text-sm text-spark">Enter a valid hex colour (e.g. #FF006C).</p>}

        {rgb && (
          <p className="text-sm text-muted">
            rgb({rgb.r}, {rgb.g}, {rgb.b})
          </p>
        )}
      </div>

      {cmyk && (
        <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
          <div className="rounded-lg border border-subtle h-20" style={{ background: hex }} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['c', 'm', 'y', 'k'] as const).map((k) => (
              <label key={k} className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
                  {k.toUpperCase()} %
                </span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={cmyk[k]}
                  onChange={(e) => setFromCmyk({ ...cmyk, [k]: clamp100(Number(e.target.value)) })}
                  className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
