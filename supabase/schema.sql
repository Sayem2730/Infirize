-- InfirizeTech schema.
-- BEFORE RUNNING: replace ADMIN_EMAIL_HERE (lowercase) with your admin login email.
-- Do this inside the Supabase SQL editor, never in a file you commit.

create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  text text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null default '',
  text text not null default '',
  image_url text,
  link_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'ADMIN_EMAIL_HERE'
$$;

alter table public.site_content enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.messages enable row level security;

grant select on public.site_content, public.services, public.projects to anon, authenticated;
grant insert on public.messages to anon;
grant all on public.site_content, public.services, public.projects, public.messages to authenticated;

drop policy if exists "public read content" on public.site_content;
create policy "public read content" on public.site_content for select to anon, authenticated using (true);
drop policy if exists "admin manage content" on public.site_content;
create policy "admin manage content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read services" on public.services;
create policy "public read services" on public.services for select to anon, authenticated using (true);
drop policy if exists "admin manage services" on public.services;
create policy "admin manage services" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select to anon, authenticated using (published);
drop policy if exists "admin manage projects" on public.projects;
create policy "admin manage projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone can send a message" on public.messages;
create policy "anyone can send a message" on public.messages for insert to anon, authenticated
  with check (
    char_length(trim(name)) between 1 and 200
    and char_length(trim(email)) between 3 and 320
    and char_length(trim(message)) between 1 and 5000
  );
drop policy if exists "admin manage messages" on public.messages;
create policy "admin manage messages" on public.messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.projects (title, tag, text, sort_order)
select t, g, x, o from (values
  ('Project one', 'Website', 'Replace this with a short description of the project and the result.', 1),
  ('Project two', 'Web app', 'Replace this with a short description of the project and the result.', 2),
  ('Project three', 'Branding', 'Replace this with a short description of the project and the result.', 3)
) as s(t, g, x, o)
where not exists (select 1 from public.projects);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 5242880, array['image/jpeg'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "site images public read" on storage.objects;
create policy "site images public read" on storage.objects for select using (bucket_id = 'site-images');
drop policy if exists "site images admin insert" on storage.objects;
create policy "site images admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "site images admin update" on storage.objects;
create policy "site images admin update" on storage.objects for update to authenticated using (bucket_id = 'site-images' and public.is_admin());
drop policy if exists "site images admin delete" on storage.objects;
create policy "site images admin delete" on storage.objects for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());
