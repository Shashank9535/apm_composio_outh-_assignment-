create extension if not exists pgcrypto;

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) between 1 and 60),
  app_name text not null check (length(app_name) between 1 and 100),
  app_url text null,
  guide_json jsonb not null,
  sources_json jsonb not null default '[]'::jsonb,
  generation_status text not null default 'complete' check (generation_status in ('complete')),
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_verified_at timestamptz null
);

create index if not exists guides_created_at_idx on public.guides (created_at desc);
create index if not exists guides_app_name_idx on public.guides (lower(app_name));

alter table public.guides enable row level security;
revoke all on table public.guides from anon, authenticated;
grant select on table public.guides to anon, authenticated;
drop policy if exists "Public guides are readable" on public.guides;
create policy "Public guides are readable" on public.guides
  for select to anon, authenticated using (is_public = true);

-- Writes are intentionally restricted to a server-side Supabase secret/service role key.
-- That key bypasses RLS; never expose it to the browser. This API validates every write.

