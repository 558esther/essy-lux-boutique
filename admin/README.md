# ESSY-LUX — Admin Dashboard

The management dashboard for the ESSY-LUX store: products, categories,
collections, orders, customers, homepage content, media library and
settings (business info + WhatsApp message templates). A standalone static
single-page app, deployed **separately** from the [`client/`](../client)
storefront — different domain, different deploy, no shared code path.

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- [TanStack Router](https://tanstack.com/router) (file-based routing, client-only — no SSR)
- [TanStack Query](https://tanstack.com/query) for data fetching/caching
- [Supabase Auth](https://supabase.com/docs/guides/auth) for real sign-in, [Supabase](https://supabase.com) (Postgres + Storage) for data
- Tailwind CSS v4 + a small set of [shadcn/ui](https://ui.shadcn.com)-style components (`src/components/ui`)

## Setup

```sh
npm install
cp .env.example .env
```

Fill in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxx
VITE_STOREFRONT_URL=https://essylux.com
```

The first two are the same values used by the [`client/`](../client) app.
`VITE_STOREFRONT_URL` is only used for the "View shop" / "View product"
links in the dashboard header and product list — point it at wherever the
storefront is actually deployed.

The database itself is set up once — see
[../supabase/README.md](../supabase/README.md) for the SQL to run and how
to create your first admin login.

```sh
npm run dev       # start the dev server
npm run build     # build to dist/
npm run preview   # locally preview the production build
```

## How authentication works

Sign-in at `/login` uses real Supabase Auth (`supabase.auth.signInWithPassword`)
— there is no hardcoded password anywhere in this code. After signing in,
the account must also have a row in the `profiles` table with
`role = 'admin'` (see the "promote to admin" SQL in
[../supabase/README.md](../supabase/README.md)) before the dashboard
unlocks; otherwise it shows "Access denied."

The real security boundary is **Row Level Security** on the Supabase side,
not this app's client-side route guard — even a modified or self-hosted
copy of this dashboard can't write data without a valid admin session,
because the database itself enforces it.

## Deploying

This builds to a plain static `dist/` folder, same as the storefront.

**Render (Static Site)**
- Root Directory: `admin`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Redirects/Rewrites: add a rule — Source `/*`, Destination `/index.html`, Action **Rewrite**
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_STOREFRONT_URL`

**Netlify / Cloudflare Pages**
- Auto-detects the included `public/_redirects` file — point the build at
  this folder with the same build command and publish directory as above.

Because this is a separate deployment, it will have its own URL — e.g.
`https://essy-lux-admin.onrender.com` or a subdomain like
`admin.essylux.com`. It intentionally does **not** live at `/admin` on the
storefront's own domain anymore, which is one layer more isolated: the
admin dashboard's code (and any future admin-only vulnerability) is never
served to a regular customer's browser at all.
