import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  apps,
  tools,
  platforms,
  apiProviders,
  credentials,
} from './config/innsaeit-os.config';
import { toolsRegistry } from './config/tools-registry.config';
import type { AppEntry, ServiceEntry, ToolEntry, ToolHubEntry } from './types';
import AppCard from './components/AppCard';
import ServiceCard from './components/ServiceCard';
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';

function appHaystack(a: AppEntry): string {
  return [
    a.name,
    a.description,
    a.notes ?? '',
    a.stack.join(' '),
    a.backends.map((b) => b.label).join(' '),
    a.bitwardenItem ?? '',
  ]
    .join(' ')
    .toLowerCase();
}

function serviceHaystack(s: ServiceEntry): string {
  return [s.name, s.description, s.notes ?? '', s.category, s.bitwardenItem ?? '']
    .join(' ')
    .toLowerCase();
}

function toolHaystack(t: ToolEntry): string {
  return [t.name, t.description, t.badge ?? ''].join(' ').toLowerCase();
}

function registryHaystack(t: ToolHubEntry): string {
  return [t.name, t.description, t.category, ...(t.keywords ?? [])].join(' ').toLowerCase();
}

/** Group client apps by `client`, preserving first-seen order. */
function groupByClient(list: AppEntry[]): [string, AppEntry[]][] {
  const map = new Map<string, AppEntry[]>();
  for (const a of list) {
    const key = a.client ?? 'Other Clients';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }
  return [...map.entries()];
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-8">
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emphasis">{title}</h2>
        {subtitle && (
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
            {subtitle}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

function ToolCard({ tool }: { tool: ToolEntry }) {
  const body = (
    <>
      <h3 className="text-xl font-extrabold text-emphasis leading-[0.95]">{tool.name}</h3>
      <p className="text-sm text-subtle leading-relaxed flex-1">{tool.description}</p>
      <div className="flex items-center justify-between gap-2">
        {tool.badge && (
          <span className="text-[11px] font-semibold text-brand-default">🔒 {tool.badge}</span>
        )}
        <span className="tap px-3 rounded-lg bg-brand-default text-brand font-bold text-sm ml-auto">
          {tool.url ? 'Open ↗' : 'Open →'}
        </span>
      </div>
    </>
  );

  const className =
    'flex flex-col gap-3 rounded-xl border border-subtle bg-subtle p-5 hover:border-brand-default transition-colors';

  if (tool.url) {
    return (
      <a href={tool.url} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link to={tool.route!} className={className}>
      {body}
    </Link>
  );
}

function RegistryHitCard({ entry }: { entry: ToolHubEntry }) {
  const className =
    'flex flex-col gap-1 rounded-lg border border-subtle bg-subtle px-3 py-2 hover:border-brand-default transition-colors';
  const body = (
    <>
      <span className="text-sm font-bold text-emphasis">{entry.name}</span>
      <span className="text-xs text-muted line-clamp-1">{entry.description}</span>
    </>
  );
  if (entry.status === 'built' && entry.route) {
    return (
      <Link to={entry.route} className={className}>
        {body}
      </Link>
    );
  }
  if (entry.url) {
    return (
      <a href={entry.url} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return null; // backlog entries aren't clickable, skip in the deep-search strip
}

const GRID = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
const REGISTRY_HIT_CAP = 6;

export default function Launcher() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!q) return { apps, tools, platforms, apiProviders, credentials };
    return {
      apps: apps.filter((a) => appHaystack(a).includes(q)),
      tools: tools.filter((t) => toolHaystack(t).includes(q)),
      platforms: platforms.filter((s) => serviceHaystack(s).includes(q)),
      apiProviders: apiProviders.filter((s) => serviceHaystack(s).includes(q)),
      credentials: credentials.filter((s) => serviceHaystack(s).includes(q)),
    };
  }, [q]);

  const registryHits = useMemo(() => {
    if (!q) return [];
    return toolsRegistry.filter((t) => t.status !== 'backlog' && registryHaystack(t).includes(q));
  }, [q]);

  const operatingApps = filtered.apps.filter((a) => a.group === 'operating');
  const clientGroups = groupByClient(
    filtered.apps.filter((a) => a.group === 'client'),
  );

  const count =
    filtered.apps.length +
    filtered.tools.length +
    filtered.platforms.length +
    filtered.apiProviders.length +
    filtered.credentials.length +
    registryHits.length;

  return (
    <div className="min-h-dvh px-4 pb-24 max-w-6xl mx-auto">
      <SearchBar value={query} onChange={setQuery} count={count} />

      <header className="pt-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
              Design Innsæit
            </p>
            <h1 className="mt-1 text-4xl sm:text-6xl font-extrabold text-emphasis leading-[0.9] -tracking-[0.04em]">
              Innsæit&nbsp;OS
            </h1>
            <p className="mt-3 max-w-xl text-subtle leading-relaxed">
              One page to every app and console you run. A map, not a store —
              <span className="text-emphasis"> zero secrets live here.</span> Real
              credentials stay in Bitwarden.
            </p>
          </div>
          <ThemeToggle />
        </div>

        {operatingApps.length > 0 && (
          <div className="mt-8 rounded-2xl border border-brand-default/30 bg-subtle/60 p-5 sm:p-6">
            <div className="mb-5 flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emphasis">
                My Operating Apps
              </h2>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
                daily drivers
              </span>
            </div>
            <div className={GRID}>
              {operatingApps.map((a) => (
                <AppCard key={a.id} app={a} />
              ))}
            </div>
          </div>
        )}
      </header>

      {filtered.credentials.length > 0 && (
        <Section title="Credentials">
          <div className={GRID}>
            {filtered.credentials.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </Section>
      )}

      {filtered.tools.length > 0 && (
        <Section title="Tools" subtitle="in-browser · nothing uploaded">
          <div className={GRID}>
            {filtered.tools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </Section>
      )}

      {registryHits.length > 0 && (
        <Section title="Also in the Tool Hub" subtitle={`${registryHits.length} match${registryHits.length === 1 ? '' : 'es'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {registryHits.slice(0, REGISTRY_HIT_CAP).map((entry) => (
              <RegistryHitCard key={entry.id} entry={entry} />
            ))}
          </div>
          {registryHits.length > REGISTRY_HIT_CAP && (
            <Link
              to={`/tools?q=${encodeURIComponent(query)}`}
              className="tap mt-3 inline-flex text-sm font-semibold text-brand-default hover:underline"
            >
              See all {registryHits.length} in Tool Hub →
            </Link>
          )}
        </Section>
      )}

      {clientGroups.length > 0 && (
        <Section title="Client Portals" subtitle="by client">
          <div className="flex flex-col gap-8">
            {clientGroups.map(([client, list]) => (
              <div key={client}>
                <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-subtle">
                  {client}
                </h3>
                <div className={GRID}>
                  {list.map((a) => (
                    <AppCard key={a.id} app={a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {filtered.platforms.length > 0 && (
        <Section title="Platforms" subtitle="infra dashboards">
          <div className={GRID}>
            {filtered.platforms.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </Section>
      )}

      {filtered.apiProviders.length > 0 && (
        <Section title="API Providers" subtitle="consoles + key rotation">
          <div className={GRID}>
            {filtered.apiProviders.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </Section>
      )}

      {count === 0 && (
        <p className="mt-16 text-center text-muted">No matches for “{query}”.</p>
      )}

      <footer className="mt-20 pt-6 border-t border-subtle text-xs text-muted">
        Edit <code className="text-brand-default">src/config/innsaeit-os.config.ts</code> to
        add or change entries. This app stores no secrets.
      </footer>
    </div>
  );
}
