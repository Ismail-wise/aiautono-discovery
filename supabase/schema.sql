create extension if not exists pgcrypto;

create table if not exists public.discovery_projects (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text not null,
  email text not null,
  department text not null,
  status text not null default 'review' check (status in ('review','approved')),
  answers jsonb not null default '{}'::jsonb,
  analysis jsonb not null default '{}'::jsonb,
  approved boolean not null default false,
  approved_at timestamptz,
  approval_ip text,
  approval_user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists discovery_projects_created_at_idx on public.discovery_projects (created_at desc);
create index if not exists discovery_projects_status_idx on public.discovery_projects (status);
create index if not exists discovery_projects_email_idx on public.discovery_projects (lower(email));

alter table public.discovery_projects enable row level security;

-- No public policies are intentionally created.
-- Browser clients cannot read or write this table directly.
-- The Next.js server uses the Supabase service role key for controlled API access.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists discovery_projects_set_updated_at on public.discovery_projects;
create trigger discovery_projects_set_updated_at
before update on public.discovery_projects
for each row execute function public.set_updated_at();
