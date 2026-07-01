type Props = {
  value: string;
  onChange: (v: string) => void;
  count: number;
};

export default function SearchBar({ value, onChange, count }: Props) {
  return (
    <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-default/85 backdrop-blur-md border-b border-subtle">
      <div className="relative max-w-2xl">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Filter apps, platforms, tags…"
          aria-label="Filter entries"
          className="w-full min-h-[44px] pl-11 pr-4 rounded-xl bg-subtle border border-subtle text-emphasis placeholder:text-muted outline-none focus:border-brand-default focus:ring-2 focus:ring-brand-default/30 transition"
        />
        {value && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">
            {count} match{count === 1 ? '' : 'es'}
          </span>
        )}
      </div>
    </div>
  );
}
