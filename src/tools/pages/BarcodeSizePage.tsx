import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { calculateBarcodeSize } from '../lib/barcodeSize';

export default function BarcodeSizePage() {
  const [symbology, setSymbology] = useState<'ean13' | 'upca'>('ean13');
  const [magnificationPct, setMagnificationPct] = useState(100);

  const result = calculateBarcodeSize({ symbology, magnificationPct });

  return (
    <ToolLayout
      title="Barcode Print Size Calculator"
      subtitle="EAN-13/UPC-A physical size and quiet-zone width at a given magnification — GS1 allows 80%-200%."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Symbology</span>
          <select
            value={symbology}
            onChange={(e) => setSymbology(e.target.value as 'ean13' | 'upca')}
            className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
          >
            <option value="ean13">EAN-13</option>
            <option value="upca">UPC-A</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">
            Magnification · {magnificationPct}%
          </span>
          <input
            type="range"
            min={80}
            max={200}
            step={5}
            value={magnificationPct}
            onChange={(e) => setMagnificationPct(Number(e.target.value))}
            className="accent-[color:var(--cal-brand)]"
          />
        </label>
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        {!result.inRange && (
          <p className="text-sm text-spark">Outside GS1's recommended 80%–200% magnification range.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Width</p>
            <p className="text-lg font-bold text-emphasis">{result.widthMm} mm</p>
          </div>
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Height</p>
            <p className="text-lg font-bold text-emphasis">{result.heightMm} mm</p>
          </div>
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Quiet zone (left)</p>
            <p className="text-lg font-bold text-emphasis">{result.quietLeftMm} mm</p>
          </div>
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Quiet zone (right)</p>
            <p className="text-lg font-bold text-emphasis">{result.quietRightMm} mm</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
