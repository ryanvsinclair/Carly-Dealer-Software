create table if not exists public.dealer_invitations (
  id uuid primary key default gen_random_uuid(),
  dealership_id uuid not null references public.dealerships(id) on delete cascade,
  email text not null,
  role public.dealer_role not null,
  token text not null unique,
  status text not null default 'pending' check (status in ('pending','accepted','revoked','expired')),
  invited_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz null,
  accepted_by uuid null references auth.users(id)
);

create index if not exists dealer_invitations_dealership_id_idx
  on public.dealer_invitations(dealership_id);

create index if not exists dealer_invitations_email_idx
  on public.dealer_invitations(email);

create index if not exists dealer_invitations_status_idx
  on public.dealer_invitations(status);

alter table public.dealer_invitations enable row level security;

-- Helper: check if current user is active member of dealership
create or replace function public.is_active_dealer_member(did uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.dealer_memberships dm
    where dm.dealership_id = did
      and dm.user_id = auth.uid()
      and dm.is_active = true
  );
$$;

-- 1) Dealership staff can create invites for their dealership
drop policy if exists "Dealer staff can create invitations" on public.dealer_invitations;
create policy "Dealer staff can create invitations"
on public.dealer_invitations
for insert
to authenticated
with check (
  public.is_active_dealer_member(dealership_id)
  and invited_by = auth.uid()
  and status = 'pending'
);

-- 2) Dealership staff can view invites for their dealership
drop policy if exists "Dealer staff can view invitations" on public.dealer_invitations;
create policy "Dealer staff can view invitations"
on public.dealer_invitations
for select
to authenticated
using (
  public.is_active_dealer_member(dealership_id)
);

-- 3) Invited user can view their own invite by email (for accept screen UX)
drop policy if exists "Invited user can view their invite" on public.dealer_invitations;
create policy "Invited user can view their invite"
on public.dealer_invitations
for select
to authenticated
using (
  lower(email) = lower((select email from public.profiles where id = auth.uid()))
);

-- 4) Only dealership staff can revoke (update status)
drop policy if exists "Dealer staff can revoke invitations" on public.dealer_invitations;
create policy "Dealer staff can revoke invitations"
on public.dealer_invitations
for update
to authenticated
using (
  public.is_active_dealer_member(dealership_id)
)
with check (
  public.is_active_dealer_member(dealership_id)
and status in ('revoked','expired')
);

-- Note: accept flow will be done via RPC with service logic to avoid exposing token updates.
