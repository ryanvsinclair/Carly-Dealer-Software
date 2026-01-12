-- dealer_access_requests: captures onboarding / access requests for dealer users
create table if not exists public.dealer_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text null,
  dealership_code text null,
  dealership_name text null,
  requested_role text null,
  message text null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dealer_access_requests_user_id_idx
  on public.dealer_access_requests(user_id);

create index if not exists dealer_access_requests_status_idx
  on public.dealer_access_requests(status);

-- updated_at trigger (only if your project uses this pattern)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_dealer_access_requests_updated_at on public.dealer_access_requests;
create trigger set_dealer_access_requests_updated_at
before update on public.dealer_access_requests
for each row execute function public.set_updated_at();

-- Enable RLS
alter table public.dealer_access_requests enable row level security;

-- Policies:
-- 1) Users can create their own access requests
drop policy if exists "Users can insert their own access requests" on public.dealer_access_requests;
create policy "Users can insert their own access requests"
on public.dealer_access_requests
for insert
to authenticated
with check (user_id = auth.uid());

-- 2) Users can view their own access requests
drop policy if exists "Users can view their own access requests" on public.dealer_access_requests;
create policy "Users can view their own access requests"
on public.dealer_access_requests
for select
to authenticated
using (user_id = auth.uid());

-- 3) Users cannot update/delete requests (immutable audit trail)
-- No update/delete policies added intentionally.
