import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useSearchParams } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const TABS = [
  { to: '/', label: 'Home', end: true },
  { to: '/tools', label: 'Tool Hub', end: false },
  { to: '/settings', label: 'Settings', end: false },
];

export default function AppShell() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const inputRef = useRef<HTMLInputElement>(null);

  function setQuery(next: string) {
    const params = new URLSearchParams(searchParams);
    if (next) params.set('q', next);
    else params.delete('q');
    setSearchParams(params, { replace: true });
  }

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

  return (
    <div className="min-h-dvh">
      <div className="sticky top-0 z-20 bg-default/85 backdrop-blur-md border-b border-subtle">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <span className="font-cal font-extrabold text-emphasis text-lg -tracking-[0.02em] shrink-0">
            Innsæit&nbsp;OS
          </span>

          <nav className="flex items-center gap-1 shrink-0">
            {TABS.map((tab) => (
              <NavLink
                key={tab.to}
                to={{ pathname: tab.to, search: searchParams.toString() }}
                end={tab.end}
                className={({ isActive }) =>
                  `tap px-3 rounded-lg text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-brand-default text-brand'
                      : 'text-subtle hover:text-brand-default'
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <div className="relative flex-1 min-w-[160px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden>
              🔍
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search everything… (press /)"
              aria-label="Search everything"
              className="w-full min-h-[40px] pl-10 pr-4 rounded-xl bg-subtle border border-subtle text-emphasis placeholder:text-muted outline-none focus:border-brand-default focus:ring-2 focus:ring-brand-default/30 transition"
            />
          </div>

          <ThemeToggle />
        </div>
      </div>

      <Outlet />
    </div>
  );
}
