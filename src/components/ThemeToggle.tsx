import { useEffect, useState } from 'react';

function getInitial(): boolean {
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark');
  }
  return true;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      /* private mode / storage disabled — theme just won't persist */
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="tap px-4 rounded-full border border-subtle bg-subtle text-subtle font-semibold text-sm hover:border-brand-default hover:text-brand-default transition-colors"
    >
      <span aria-hidden>{dark ? '☀️' : '🌙'}</span>
      <span>{dark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}
