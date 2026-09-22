-- ============================================================
-- Run this AFTER creating the admin login in Supabase Auth:
-- Dashboard → Authentication → Users → Add user
--   Email:    kariukiesther558@gmail.com
--   Password: (the one you chose)
--   Auto Confirm User: ON
--
-- Then run this script in the SQL Editor to grant that user
-- admin access to the ESSY-LUX dashboard.
-- ============================================================
insert into public.profiles (id, role, full_name)
select id, 'admin', 'Esther'
from auth.users
where email = 'kariukiesther558@gmail.com'
on conflict (id) do update set role = 'admin';
