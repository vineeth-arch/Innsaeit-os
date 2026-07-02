import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { convert, mmToPx, UNITS, type Unit } from '../lib/units';

const DPI_PRESETS = [72, 150, 300, 600];

export default function UnitsPage() {
  const [value, setValue] = useState(25.4);
  const [from, setFrom] = useState<Unit>('mm');

  return (
    <ToolLayout title="Unit Converter" subtitle="mm, cm, inch, points, picas and pixels-at-DPI — pure browser math.">
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Value</span>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">From unit</span>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value as Unit)}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            >
              {UNITS.map((u) => (
                <option key={u.key} value={u.key}>{u.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Converted</span>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {UNITS.filter((u) => u.key !== from).map((u) => (
            <div key={u.key} className="rounded-lg border border-subtle p-3">
              <p className="text-xs text-muted">{u.label}</p>
              <p className="text-lg font-bold text-emphasis">
                {Math.round(convert(value, from, u.key) * 1000) / 1000}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
          Pixels at DPI
        </p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DPI_PRESETS.map((dpi) => (
            <div key={dpi} className="rounded-lg border border-subtle p-3">
              <p className="text-xs text-muted">{dpi} DPI</p>
              <p className="text-lg font-bold text-emphasis">
                {mmToPx(convert(value, from, 'mm'), dpi)} px
              </p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
