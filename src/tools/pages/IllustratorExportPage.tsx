import ToolLayout from '../components/ToolLayout';

export default function IllustratorExportPage() {
  return (
    <ToolLayout
      title="Illustrator: Export Artboard as JPG + PDF"
      subtitle="A downloadable Illustrator script that exports the active artboard as a high-quality JPG and PDF in one go."
    >
      <div className="rounded-xl border border-subtle bg-subtle p-5 flex flex-col gap-4">
        <a
          href="/scripts/export-artboard-jpg-pdf.jsx"
          download
          className="tap self-start px-4 rounded-xl bg-brand-default text-brand font-bold text-sm hover:bg-brand-emphasis transition-colors"
        >
          Download export-artboard-jpg-pdf.jsx
        </a>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">How to use</span>
          <ol className="mt-2 list-decimal pl-5 text-sm text-subtle leading-relaxed space-y-1">
            <li>Download the <code className="text-brand-default">.jsx</code> file above.</li>
            <li>Open your artwork in Adobe Illustrator and select the artboard you want.</li>
            <li>Go to <strong className="text-emphasis">File ▸ Scripts ▸ Other Script…</strong> and pick the file.</li>
            <li>Choose an export folder — it writes <code>{'{document}-{artboard}'}.jpg</code> (2×, quality 100) and <code>.pdf</code> ([High Quality Print]).</li>
          </ol>
        </div>

        <div className="rounded-lg border border-spark/40 bg-spark/10 p-3 text-sm text-subtle">
          ⚠️ This script was written best-effort and <strong className="text-emphasis">has not been tested inside
          Illustrator</strong> by the author. Run it on a copy of your file first and adjust the options
          (quality, scale, PDF preset) to your setup.
        </div>
      </div>
    </ToolLayout>
  );
}
