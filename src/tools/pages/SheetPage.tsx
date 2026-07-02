import { useState } from 'react';
import ToolLayout from '../components/ToolLayout';
import { calculateSheet } from '../lib/sheet';

export default function SheetPage() {
  const [sheetWidthMm, setSheetWidthMm] = useState(320);
  const [sheetHeightMm, setSheetHeightMm] = useState(450);
  const [pieceWidthMm, setPieceWidthMm] = useState(210);
  const [pieceHeightMm, setPieceHeightMm] = useState(297);
  const [marginMm, setMarginMm] = useState(0);
  const [gutterMm, setGutterMm] = useState(0);

  const result = calculateSheet({ sheetWidthMm, sheetHeightMm, pieceWidthMm, pieceHeightMm, marginMm, gutterMm });

  const fields: { label: string; value: number; set: (n: number) => void }[] = [
    { label: 'Sheet width (mm)', value: sheetWidthMm, set: setSheetWidthMm },
    { label: 'Sheet height (mm)', value: sheetHeightMm, set: setSheetHeightMm },
    { label: 'Piece width (mm)', value: pieceWidthMm, set: setPieceWidthMm },
    { label: 'Piece height (mm)', value: pieceHeightMm, set: setPieceHeightMm },
    { label: 'Margin (mm)', value: marginMm, set: setMarginMm },
    { label: 'Gutter (mm)', value: gutterMm, set: setGutterMm },
  ];

  return (
    <ToolLayout
      title="Sheet Cutting Calculator"
      subtitle="How many pieces fit a parent sheet — checks both grain orientations and keeps the higher yield."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {fields.map((f) => (
          <label key={f.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">{f.label}</span>
            <input
              type="number"
              min={0}
              value={f.value}
              onChange={(e) => f.set(Math.max(0, Number(e.target.value)))}
              className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis"
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">Pieces per sheet</span>
          <p className="mt-1 text-3xl font-extrabold text-emphasis">{result.count}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Layout</p>
            <p className="text-lg font-bold text-emphasis">{result.cols} × {result.rows}</p>
          </div>
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Orientation</p>
            <p className="text-lg font-bold text-emphasis capitalize">{result.orientation}</p>
          </div>
          <div className="rounded-lg border border-subtle p-3">
            <p className="text-xs text-muted">Sheet used</p>
            <p className="text-lg font-bold text-emphasis">{result.usedAreaPct}%</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
