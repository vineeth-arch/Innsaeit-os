// Pure, dependency-free text case conversions. Covers the five cases from the
// caseconverter project (lower / upper / title / capital / sentence) plus the
// common programming cases (camel / pascal / snake / kebab / constant), which are
// handy for slugs and SKU naming. Each fn is (str) => str and safe on empty input.

// Minor words kept lowercase in Title Case (unless first/last word).
const MINOR = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on',
  'or', 'per', 'the', 'to', 'via', 'vs', 'with',
]);

const cap = (w: string): string => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w);

// Split arbitrary text into lowercase word tokens, handling spaces, underscores,
// hyphens and camelCase/PascalCase boundaries. Used by the programming cases.
export function tokenize(s: string): string[] {
  return (s || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // camelCase boundary
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // ABCWord -> ABC Word
    .split(/[\s_\-./]+/)
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}

export function toLower(s: string): string {
  return (s || '').toLowerCase();
}

export function toUpper(s: string): string {
  return (s || '').toUpperCase();
}

export function toCapital(s: string): string {
  // Capitalize the first letter of every word; lowercase the rest of each word.
  return (s || '').replace(/\S+/g, (w) => cap(w.toLowerCase()));
}

export function toTitle(s: string): string {
  const words = (s || '').toLowerCase().split(/(\s+)/); // keep whitespace tokens
  const realIdx = words.map((w, i) => (/\S/.test(w) ? i : -1)).filter((i) => i >= 0);
  const first = realIdx[0];
  const last = realIdx[realIdx.length - 1];
  return words
    .map((w, i) => {
      if (!/\S/.test(w)) return w;
      const bare = w.toLowerCase();
      if (i !== first && i !== last && MINOR.has(bare)) return bare;
      return cap(bare);
    })
    .join('');
}

export function toSentence(s: string): string {
  // Lowercase everything, then capitalize the first letter after sentence enders.
  const lower = (s || '').toLowerCase();
  return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase());
}

export function toCamel(s: string): string {
  return tokenize(s)
    .map((t, i) => (i === 0 ? t : cap(t)))
    .join('');
}

export function toPascal(s: string): string {
  return tokenize(s).map(cap).join('');
}

export function toSnake(s: string): string {
  return tokenize(s).join('_');
}

export function toKebab(s: string): string {
  return tokenize(s).join('-');
}

export function toConstant(s: string): string {
  return tokenize(s).join('_').toUpperCase();
}

export type CaseKey =
  | 'lower' | 'upper' | 'title' | 'capital' | 'sentence'
  | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant';

export type CaseDef = { key: CaseKey; label: string; fn: (s: string) => string };

// Ordered list for the UI. The first five mirror the source project.
export const CASES: CaseDef[] = [
  { key: 'lower', label: 'lowercase', fn: toLower },
  { key: 'upper', label: 'UPPERCASE', fn: toUpper },
  { key: 'title', label: 'Title Case', fn: toTitle },
  { key: 'capital', label: 'Capital Case', fn: toCapital },
  { key: 'sentence', label: 'Sentence case', fn: toSentence },
  { key: 'camel', label: 'camelCase', fn: toCamel },
  { key: 'pascal', label: 'PascalCase', fn: toPascal },
  { key: 'snake', label: 'snake_case', fn: toSnake },
  { key: 'kebab', label: 'kebab-case', fn: toKebab },
  { key: 'constant', label: 'CONSTANT_CASE', fn: toConstant },
];
