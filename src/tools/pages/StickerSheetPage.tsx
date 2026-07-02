import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../components/ToolLayout';
import { calculateSheet } from '../lib/sheet';
import { mmToPx } from '../lib/units';

const SHEETS = [
  { key: 'A4', w: 210, h: 297 },
  { key: 'A3', w: 297, h: 420 },
  { key: 'SRA3', w: 320, h: 450 },
];

const MM_PER_PT = 25.4 / 72;

export default function StickerSheetPage() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [sheetKey, setSheetKey] = useState('A4');
  const [labelW, setLabelW] = useState(50);
  const [labelH, setLabelH] = useState(50);
  const [gutter, setGutter] = useState(2);
  const [margin, setMargin] = useState(8);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sheet = SHEETS.find((s) => s.key === sheetKey)!;
  const grid = calculateSheet({
    sheetWidthMm: sheet.w,
    sheetHeightMm: sheet.h,
    pieceWidthMm: labelW,
    pieceHeightMm: labelH,
    marginMm: margin,
    gutterMm: gutter,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Preview at a modest DPI to keep it light.
    const dpi = 96;
    canvas.width = mmToPx(sheet.w, dpi);
    canvas.height = mmToPx(sheet.h, dpi);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!img) return;
    drawGrid(ctx, img, dpi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, sheetKey, labelW, labelH, gutter, margin]);

  function drawGrid(ctx: CanvasRenderingContext2D, image: HTMLImageElement, dpi: number) {
    const rotated = grid.orientation === 'rotated';
    const pw = rotated ? labelH : labelW;
    const ph = rotated ? labelW : labelH;
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const xMm = margin + c * (pw + gutter);
        const yMm = margin + r * (ph + gutter);
        ctx.drawImage(image, mmToPx(xMm, dpi), mmToPx(yMm, dpi), mmToPx(pw, dpi), mmToPx(ph, dpi));
      }
    }
  }

  function onFile(file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      URL.revokeObjectURL(url);
    };
    image.src = url;
  }

  function downloadPng() {
    if (!img) return;
    const canvas = document.createElement('canvas');
    const dpi = 300;
    canvas.width = mmToPx(sheet.w, dpi);
    canvas.height = mmToPx(sheet.h, dpi);
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, img, dpi);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sticker-sheet-${sheetKey}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  async function downloadPdf() {
    if (!img) return;
    // Rasterise a single label to PNG bytes for embedding.
    const dpi = 300;
    const rotated = grid.orientation === 'rotated';
    const pw = rotated ? labelH : labelW;
    const ph = rotated ? labelW : labelH;
    const lc = document.createElement('canvas');
    lc.width = mmToPx(pw, dpi);
    lc.height = mmToPx(ph, dpi);
    lc.getContext('2d')!.drawImage(img, 0, 0, lc.width, lc.height);
    const pngBytes = await new Promise<ArrayBuffer>((res) =>
      lc.toBlob((b) => b!.arrayBuffer().then(res), 'image/png'),
    );

    const pdf = await PDFDocument.create();
    const pageW = sheet.w / MM_PER_PT;
    const pageH = sheet.h / MM_PER_PT;
    const page = pdf.addPage([pageW, pageH]);
    const embedded = await pdf.embedPng(pngBytes);
    const labelWpt = pw / MM_PER_PT;
    const labelHpt = ph / MM_PER_PT;
    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const xMm = margin + c * (pw + gutter);
        const yMm = margin + r * (ph + gutter);
        page.drawImage(embedded, {
          x: xMm / MM_PER_PT,
          // pdf y-origin is bottom-left → flip.
          y: pageH - yMm / MM_PER_PT - labelHpt,
          width: labelWpt,
          height: labelHpt,
        });
      }
    }
    const bytes = await pdf.save();
    const url = URL.createObjectURL(new Blob([bytes.slice().buffer], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `sticker-sheet-${sheetKey}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const fields: { label: string; value: number; set: (n: number) => void }[] = [
    { label: 'Label width (mm)', value: labelW, set: setLabelW },
    { label: 'Label height (mm)', value: labelH, set: setLabelH },
    { label: 'Gutter (mm)', value: gutter, set: setGutter },
    { label: 'Margin (mm)', value: margin, set: setMargin },
  ];

  return (
    <ToolLayout
      title="Sticker Sheet Generator"
      subtitle="Repeat a label/sticker across an A4/A3/SRA3 sheet and export a print-ready PNG or PDF — runs in your browser."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 max-w-sm">
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Label artwork (image/SVG)</span>
          <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm text-subtle" />
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">Sheet</span>
            <select value={sheetKey} onChange={(e) => setSheetKey(e.target.value)} className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis">
              {SHEETS.map((s) => (
                <option key={s.key} value={s.key}>{s.key}</option>
              ))}
            </select>
          </label>
          {fields.map((f) => (
            <label key={f.label} className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-subtle">{f.label}</span>
              <input type="number" min={0} value={f.value} onChange={(e) => f.set(Math.max(0, Number(e.target.value)))} className="min-h-[44px] px-3 rounded-lg bg-default border border-subtle text-emphasis" />
            </label>
          ))}
        </div>
        <p className="text-sm text-subtle">
          <strong className="text-emphasis">{grid.count}</strong> labels per sheet · {grid.cols} × {grid.rows} · {grid.orientation}
        </p>
        {img && (
          <div className="flex flex-wrap gap-2">
            <button onClick={downloadPng} className="tap px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors">Download PNG (300dpi)</button>
            <button onClick={downloadPdf} className="tap px-4 rounded-xl border border-subtle text-subtle font-semibold text-sm hover:text-emphasis transition-colors">Download PDF</button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-subtle bg-subtle p-5 flex justify-center">
        <canvas ref={canvasRef} className="max-w-full max-h-[70vh] rounded border border-subtle" />
      </div>
    </ToolLayout>
  );
}
