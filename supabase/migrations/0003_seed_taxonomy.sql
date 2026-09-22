-- ============================================================
-- Starter categories & collections so the Add Product form has
-- something to select from on day one. Run after 0001_init.sql.
-- Safe to re-run (ON CONFLICT DO NOTHING).
-- ============================================================

insert into public.categories (name, slug, display_order) values
  ('Tote', 'tote', 1),
  ('Satchel', 'satchel', 2),
  ('Crossbody', 'crossbody', 3),
  ('Shoulder Bag', 'shoulder-bag', 4),
  ('Handbag', 'handbag', 5),
  ('Mini Bag', 'mini-bag', 6),
  ('Clutch', 'clutch', 7),
  ('Other', 'other', 8)
on conflict (slug) do nothing;

insert into public.collections (name, slug, description, display_order) values
  ('The Classic Edit', 'classic', 'Timeless handbags for everyday elegance.', 1),
  ('The Feminine Edit', 'feminine', 'Soft and graceful styles with romantic details.', 2),
  ('The Signature Edit', 'signature', 'Statement pieces designed to stand out.', 3),
  ('The Everyday Edit', 'everyday', 'Practical luxury designed for everyday life.', 4)
on conflict (slug) do nothing;
