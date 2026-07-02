import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ToolLayout from '../components/ToolLayout';
import { toolsRegistry, TOOL_CATEGORIES } from '../../config/tools-registry.config';
import type { ToolHubEntry, ToolSource, ToolStatus } from '../../types';

const EXAMPLE_CHIPS = ['compress pdf', 'make barcode', 'remove background', 'calculate 3mm bleed'];

type Filter = 'all' | 'built' | 'delphi' | 'oss' | 'backlog';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'built', label: 'Built here' },
  { key: 'delphi', label: 'Delphi' },
  { key: 'oss', label: 'Open source' },
  { key: 'backlog', label: 'Backlog' },
];

function matchesFilter(entry: ToolHubEntry, filter: Filter): boolean {
  if (filter === 'all') return true;
  if (filter === 'built') return entry.status === 'built';
  if (filter === 'backlog') return entry.status === 'backlog';
  return entry.status === 'external' && entry.source === filter;
}

function haystack(t: ToolHubEntry): string {
  return [t.name, t.description, t.category, ...(t.keywords ?? [])].join(' ').toLowerCase();
}

function groupByCategory(list: ToolHubEntry[]): [string, ToolHubEntry[]][] {
  const map = new Map<string, ToolHubEntry[]>();
  for (const t of list) {
    if (!map.has(t.category)) map.set(t.category, []);
    map.get(t.category)!.push(t);
  }
  return TOOL_CATEGORIES.filter((c) => map.has(c)).map((c) => [c, map.get(c)!]);
}

const STATUS_LABEL: Record<ToolStatus, string> = {
  built: 'built here',
  external: 'external',
  backlog: 'backlog',
};

const SOURCE_LABEL: Record<ToolSource, string> = {
  delphi: 'Delphi',
  oss: 'open source',
};

function StatusPill({ entry }: { entry: ToolHubEntry }) {
  const label = entry.status === 'external' && entry.source ? SOURCE_LABEL[entry.source] : STATUS_LABEL[entry.status];
  const cls =
    entry.status === 'built'
      ? 'bg-brand-default/10 text-brand-default border-brand-default/40'
      : entry.status === 'external'
        ? 'bg-emphasis text-subtle border-subtle'
        : 'bg-transparent text-muted border-subtle';
  return (
    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${cls}`}>
      {label}
    </span>
  );
}

function ToolCardBody({ entry }: { entry: ToolHubEntry }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-extrabold text-emphasis leading-[0.95]">{entry.name}</h3>
        <StatusPill entry={entry} />
      </div>
      <p className="text-sm text-subtle leading-relaxed">{entry.description}</p>
    </>
  );
}

function ToolCard({ entry }: { entry: ToolHubEntry }) {
  if (entry.status === 'built' && entry.route) {
    // "Stretched link" pattern: the Link is an invisible full-card overlay so the
    // whole card is clickable, while altUrl renders as its own real (non-nested)
    // <a> above it — anchors can't nest, so the primary link can't wrap it.
    return (
      <div className="relative flex flex-col gap-2 rounded-xl border border-subtle bg-subtle p-4 hover:border-brand-default transition-colors">
        <Link to={entry.route} className="absolute inset-0 rounded-xl" aria-label={entry.name} />
        <div className="pointer-events-none flex flex-col gap-2">
          <ToolCardBody entry={entry} />
          <div className="mt-auto flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-brand-default">Open →</span>
            {entry.altUrl && (
              <a
                href={entry.altUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto relative text-[11px] text-muted hover:text-brand-default transition-colors"
              >
                {entry.altLabel ?? 'Also elsewhere'} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (entry.status === 'external' && entry.url) {
    return (
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-2 rounded-xl border border-subtle bg-subtle p-4 hover:border-emphasis transition-colors"
      >
        <ToolCardBody entry={entry} />
        <span className="mt-auto text-xs font-semibold text-subtle">Open ↗</span>
      </a>
    );
  }

  return (
    <article className="flex flex-col gap-2 rounded-xl border border-subtle bg-subtle/60 p-4 opacity-70">
      <ToolCardBody entry={entry} />
      <span className="mt-auto text-xs text-muted">
        On the roadmap{entry.effort ? ` · build effort ${entry.effort}/5` : ''}
      </span>
    </article>
  );
}

export default function ToolHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [filter, setFilter] = useState<Filter>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (query) next.set('q', query);
    else next.delete('q');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return toolsRegistry.filter((t) => matchesFilter(t, filter) && (!q || haystack(t).includes(q)));
  }, [q, filter]);

  const browseGroups = groupByCategory(filtered.filter((t) => t.status !== 'backlog'));
  const backlog = filtered.filter((t) => t.status === 'backlog').sort((a, b) => (a.effort ?? 0) - (b.effort ?? 0));

  return (
    <ToolLayout
      title="Tool Hub"
      subtitle="Every agency utility in one searchable place — built here, on Delphi, open source, or on the backlog."
    >
      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools… press / to focus, e.g. compress pdf, make barcode"
          aria-label="Search Tool Hub"
          className="w-full min-h-[44px] px-4 rounded-xl bg-subtle border border-subtle text-emphasis placeholder:text-muted outline-none focus:border-brand-default focus:ring-2 focus:ring-brand-default/30 transition"
        />

        <div className="flex flex-wrap gap-2">
          {EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setQuery(chip)}
              className="tap px-3 rounded-full text-xs font-semibold border border-subtle text-subtle hover:text-brand-default hover:border-brand-default transition-colors"
            >
              {chip}
            </button>
          ))}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="tap px-3 rounded-full text-xs font-semibold text-muted hover:text-emphasis transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`tap px-3 rounded-full text-xs font-bold border transition-colors ${
                filter === f.key
                  ? 'bg-brand-default text-brand border-brand-default'
                  : 'border-subtle text-subtle hover:border-brand-default hover:text-brand-default'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {browseGroups.length === 0 && backlog.length === 0 && (
        <p className="mt-4 text-center text-muted">No tools match “{query}”.</p>
      )}

      <div className="flex flex-col gap-8">
        {browseGroups.map(([category, list]) => (
          <div key={category}>
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((entry) => (
                <ToolCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {backlog.length > 0 && (
        <details className="rounded-xl border border-subtle bg-subtle/40 p-5">
          <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Backlog ({backlog.length}) — ranked by build effort
          </summary>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {backlog.map((entry) => (
              <ToolCard key={entry.id} entry={entry} />
            ))}
          </div>
        </details>
      )}
    </ToolLayout>
  );
}
