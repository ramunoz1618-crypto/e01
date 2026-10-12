-- ElevateOne: onboarding wizard + personal info. Run once in Supabase > SQL Editor
-- (after schema.sql and admin.sql). Safe to run again.

alter table public.profiles add column if not exists nickname     text;
alter table public.profiles add column if not exists phone        text;
alter table public.profiles add column if not exists address      jsonb;
alter table public.profiles add column if not exists dob          date;
alter table public.profiles add column if not exists referred_by  text;
alter table public.profiles add column if not exists interests    text[];
alter table public.profiles add column if not exists onboarded_at timestamptz;

-- People can fill in and edit their own details (still NEVER is_admin).
grant insert (nickname, phone, address, dob, referred_by, interests, onboarded_at) on public.profiles to authenticated;
grant update (nickname, phone, address, dob, referred_by, interests, onboarded_at) on public.profiles to authenticated;
-- Admins can already read every profile (from admin.sql), so the Team page will show the new details.
