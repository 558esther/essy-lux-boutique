# ESSY-LUX — Storefront

The customer-facing ESSY-LUX website: browse bags, filter by collection/colour/price,
add to bag or order directly via WhatsApp. A standalone static single-page app —
no server, no build-time coupling to the [`admin/`](../admin) dashboard.

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [TanStack Router](https://tanstack.com/router) (file-based routing, client-only — no SSR)
- [TanStack Query](https://tanstack.com/query) for data fetching/caching
- [Supabase](https://supabase.com) (Postgres + Storage) as the backend, read directly from the browser
- Tailwind CSS v4, hand-rolled design system (see `src/styles.css`) — no component library

## Setup

```sh
npm install
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
```

These are the same values used by the [`admin/`](../admin) app and come from
your Supabase project's **Settings → API** page. The database itself is set
up once — see [../supabase/README.md](../supabase/README.md).

```sh
npm run dev       # start the dev server
npm run build     # build to dist/
npm run preview   # locally preview the production build
```

## How it gets its data

Every page (`shop`, `product/:slug`, `collections`, the homepage, etc.) reads
live from Supabase directly in the browser via `src/lib/queries/catalog.ts` —
whatever the admin publishes in the [admin dashboard](../admin) appears here
immediately, no rebuild or redeploy needed. There is no fake or hardcoded
product data; an empty Supabase catalogue means an empty shop.

When a customer taps "Order via WhatsApp," the app first saves an order
**request** record to Supabase (so it shows up in the admin's Orders list),
then opens WhatsApp with a pre-filled message — the admin's configured
WhatsApp number, greeting, closing and message template (Admin → Settings →
WhatsApp) are all pulled in live too.

## Deploying

This builds to a plain static `dist/` folder — deployable anywhere that
serves static files. Because it's a single-page app, the host needs an SPA
fallback rule so a fresh visit to e.g. `/shop` doesn't 404:

**Render (Static Site)**
- Root Directory: `client`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Redirects/Rewrites: add a rule — Source `/*`, Destination `/index.html`, Action **Rewrite**
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`

**Netlify / Cloudflare Pages**
- These both auto-detect the included `public/_redirects` file
  (`/* /index.html 200`), so no extra dashboard configuration is needed —
  just point the build at this folder with the same build command and
  publish directory as above.
