// Device-local usage tracking — counts how often each tool/service is opened,
// so the Tool Hub can rank by real usefulness. localStorage only: no backend,
// no secrets, never leaves this browser.

const KEY = 'innsaeit-usage';

type UsageMap = Record<string, number>;

export function getUsage(): UsageMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as UsageMap) : {};
  } catch {
    return {};
  }
}

export function getCount(id: string): number {
  return getUsage()[id] ?? 0;
}

export function trackClick(id: string): void {
  try {
    const usage = getUsage();
    usage[id] = (usage[id] ?? 0) + 1;
    localStorage.setItem(KEY, JSON.stringify(usage));
  } catch {
    /* private mode / storage disabled — tracking is best-effort */
  }
}
