# ESSY-LUX Supabase setup

This folder holds the SQL that defines the ESSY-LUX database: products, categories,
collections, homepage content, media, orders, customers, settings, and the admin
account link. Run it once, by hand, in your Supabase project.

## 1. Run the schema

Supabase dashboard → **SQL Editor** → **New query** → paste the contents of
[`migrations/0001_init.sql`](migrations/0001_init.sql) → **Run**.

This creates all tables, Row Level Security policies, and a public storage bucket
(`essy-lux-media`) for product photos and other uploaded images.

Then run [`migrations/0003_seed_taxonomy.sql`](migrations/0003_seed_taxonomy.sql) the same way — it adds
the starter product categories (Tote, Satchel, …) and the four curated collections (Classic/Feminine/
Signature/Everyday Edit) so the Add Product form has something to select from immediately. No demo
products are seeded — the catalogue starts empty and real inventory is added from Admin → Add Product.

## 2. Create the admin login

Supabase dashboard → **Authentication** → **Users** → **Add user**:

- Email: `kariukiesther558@gmail.com`
- Password: (the one you chose)
- Auto Confirm User: **ON**

## 3. Grant that account admin access

Back in **SQL Editor**, paste and run
[`migrations/0002_promote_admin.sql`](migrations/0002_promote_admin.sql).

Without this step the account can sign in but has no admin permissions — every
product/settings write is blocked by Row Level Security until the row exists in
`public.profiles`.

## 4. Environment variables

The app needs three values, in a local `.env` (already gitignored — never commit it):

```
VITE_SUPABASE_URL=https://mmivjqtbhsughroiehug.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=...
```

- The first two are safe to expose to the browser (they're rate-limited and
  gated by Row Level Security) and power the public storefront.
- `SUPABASE_SERVICE_ROLE_KEY` is secret and is only ever read server-side (in
  TanStack Start server functions), never bundled into client code. It lets
  admin-only server functions perform writes after they've verified the caller
  has a valid admin session.

When deploying, set the same three as environment variables/secrets on your
hosting platform (e.g. `wrangler secret put SUPABASE_SERVICE_ROLE_KEY`).
