// Generic image input: drag & drop, click-to-browse, or paste from clipboard.
// Calls onFile(file) with the selected File/Blob. Kept tool-agnostic so other
// in-browser image tools can reuse it.
import { useRef, useState, useEffect, type KeyboardEvent } from 'react';

type Props = {
  onFile: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  hint?: string;
};

export default function Dropzone({ onFile, accept = 'image/*', disabled = false, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function pick(file: File | null | undefined) {
    if (!file || disabled) return;
    if (!file.type.startsWith('image/')) return;
    onFile(file);
  }

  // Paste an image straight from the clipboard (Cmd/Ctrl+V) while this tool is open.
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (disabled) return;
      const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith('image/'));
      if (item) pick(item.getAsFile());
    }
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={onKeyDown}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        pick(e.dataTransfer.files?.[0]);
      }}
      className={`min-h-[160px] flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
        over ? 'border-brand-default bg-brand-default/10' : 'border-subtle bg-subtle/60 hover:border-emphasis'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <p className="font-semibold text-emphasis">Drop an image, click to browse, or paste</p>
      <p className="text-sm text-muted">{hint || 'PNG, JPG, WebP — everything stays on your device.'}</p>
    </div>
  );
}
