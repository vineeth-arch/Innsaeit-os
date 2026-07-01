# Innsaeit OS

A personal, single-user **launcher / command center** for Design Innsaeit. One
branded page with deep links to every app front-end and every backend/console
you operate — apps, infra platforms, API provider consoles (with key-rotation
deep links), and the Bitwarden vault.

It's a **map + launchpad, not a data store.**

## 🔒 Security — zero secrets

This app stores **no secrets**. No passwords, API keys, tokens, or service-role
keys — not in code, config, env, or any storage. It holds only non-secret
metadata: names, URLs, deep links, stack tags, notes, and Bitwarden *item
names* (the label of the vault item, never its contents).

Real credentials live in your **Bitwarden vault**. This app only links to
login and key-rotation pages; the browser + Bitwarden handle actual auth. The
"➕ Add to Bitwarden" buttons **open** your web vault to add an item manually —
a website cannot write into your vault, and this one never tries.

## Editing entries — one file

Everything renders from a single config file:

```
src/config/innsaeit-os.config.ts
```

Add or change an app / platform / provider by editing the arrays there:

- `apps` — your front-ends (`AppEntry`)
- `platforms` — infra dashboards (`ServiceEntry`, category `Platform`)
- `apiProviders` — API consoles (`ServiceEntry`, category `API Provider`)
- `credentials` — Bitwarden vault (`ServiceEntry`, category `Credentials`)

Types are in `src/types.ts`. No UI editing in v1 — edit the file, save, done.

**Verify the URLs.** Service dashboards rebrand over time, so all dashboard and
key-rotation URLs are plain strings you can update. A few placeholders marked
`<< fill in >>` (n8n, ntfy) point at `*.example.com` — replace with your real
Cloudflare Tunnel / ntfy URLs.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # type-checks then builds to dist/
npm run preview  # serve the production build locally
```

## Deploy to Vercel

No env vars, no backend — it's a static SPA.

```bash
npm i -g vercel   # if needed
vercel            # preview
vercel --prod     # production
```

Framework preset **Vite**; build `npm run build`; output `dist`. `vercel.json`
already includes the SPA rewrite.

### Custom domain

Point a subdomain such as `os.designinnsaeit.com` at the Vercel deployment
(Vercel → Project → Domains), then add the matching CNAME in Cloudflare DNS.

## Stack

Vite · React · TypeScript · Tailwind CSS. Fonts: Bricolage Grotesque
(headings) + Hanken Grotesk (body). No database, no server.
