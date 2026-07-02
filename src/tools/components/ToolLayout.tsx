import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function ToolLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-dvh px-4 pb-24 max-w-4xl mx-auto">
      <div className="pt-8 pb-2">
        <Link
          to="/"
          className="tap text-sm font-semibold text-subtle hover:text-brand-default transition-colors"
        >
          ← Innsæit OS
        </Link>
      </div>

      <header className="pt-4 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-default">
          Studio · Tools
        </p>
        <h1 className="mt-1 text-3xl sm:text-5xl font-extrabold text-emphasis leading-[0.95] -tracking-[0.02em]">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-subtle leading-relaxed">{subtitle}</p>
      </header>

      <div className="mt-8 flex flex-col gap-6">{children}</div>
    </div>
  );
}
