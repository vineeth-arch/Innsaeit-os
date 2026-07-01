/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cal: ['var(--font-cal)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundColor: {
        default: 'var(--cal-bg)',
        subtle: 'var(--cal-bg-subtle)',
        emphasis: 'var(--cal-bg-emphasis)',
        'cal-muted': 'var(--cal-bg-muted)',
        'cal-stamp': 'var(--cal-stamp)',
        inverted: 'var(--cal-bg-inverted)',
        'brand-default': 'rgb(var(--cal-brand-rgb) / <alpha-value>)',
        'brand-emphasis': 'var(--cal-brand-emphasis)',
        spark: 'rgb(var(--cal-spark-rgb) / <alpha-value>)',
      },
      textColor: {
        emphasis: 'var(--cal-text-emphasis)',
        default: 'var(--cal-text)',
        subtle: 'var(--cal-text-subtle)',
        muted: 'var(--cal-text-muted)',
        inverted: 'var(--cal-text-inverted)',
        'brand-default': 'rgb(var(--cal-brand-rgb) / <alpha-value>)',
        brand: 'var(--cal-brand-text)',
        spark: 'rgb(var(--cal-spark-rgb) / <alpha-value>)',
      },
      borderColor: {
        default: 'var(--cal-border)',
        subtle: 'var(--cal-border-subtle)',
        emphasis: 'var(--cal-border-emphasis)',
        muted: 'var(--cal-border-muted)',
        'brand-default': 'rgb(var(--cal-brand-rgb) / <alpha-value>)',
        spark: 'rgb(var(--cal-spark-rgb) / <alpha-value>)',
      },
      ringColor: {
        'brand-default': 'rgb(var(--cal-brand-rgb) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
