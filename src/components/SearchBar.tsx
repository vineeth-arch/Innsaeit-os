type Props = {
  value: string;
  onChange: (v: string) => void;
  count: number;
};

export default function SearchBar({ value, onChange, count }: Props) {
  return (
    <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-ink/80 backdrop-blur-md border-b border-white/5">
      <div className="relative max-w-2xl">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter apps, platforms, tags…"
          aria-label="Filter entries"
          className="w-full min-h-[44px] pl-11 pr-4 rounded-xl bg-ink-2/70 border border-white/10 text-text placeholder:text-text-dim/60 outline-none focus:border-mint/60 focus:ring-2 focus:ring-mint/20 transition"
        />
        {value && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-dim">
            {count} match{count === 1 ? '' : 'es'}
          </span>
        )}
      </div>
    </div>
  );
}
