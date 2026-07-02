// Slug / SKU / filename generation — pure string ops, no dependency.

function words(s: string): string[] {
  return (s || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function toSlug(s: string): string {
  return words(s).join('-').toLowerCase();
}

export function toSku(s: string): string {
  return words(s).join('-').toUpperCase();
}

export function toFilename(s: string, ext?: string): string {
  const base = words(s).join('_').toLowerCase();
  return ext ? `${base}.${ext.replace(/^\./, '')}` : base;
}
