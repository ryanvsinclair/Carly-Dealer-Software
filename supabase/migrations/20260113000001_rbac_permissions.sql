-- ============================================================================
-- 1) Permission catalog
-- ============================================================================

create table if not exists public.dealer_permissions (
  key text primary key,                     -- e.g. 'inventory.publish'
  description text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 2) Role → permission mapping
--   Uses your existing enum: public.dealer_role
-- ============================================================================

create table if not exists public.dealer_role_permissions (
  role public.dealer_role not null,
  permission_key text not null references public.dealer_permissions(key) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role, permission_key)
);

create index if not exists idx_dealer_role_permissions_role
  on public.dealer_role_permissions(role);

create index if not exists idx_dealer_role_permissions_perm
  on public.dealer_role_permissions(permission_key);

-- ============================================================================
-- 3) Seed permissions (canonical list)
--   Adjust names once, then freeze forever.
-- ============================================================================

insert into public.dealer_permissions (key, description) values
  ('invite.create',     'Create dealer staff invitations'),
  ('invite.revoke',     'Revoke dealer staff invitations'),
  ('team.view',         'View dealership team roster'),
  ('team.manage',       'Manage dealership team (activate/deactivate/roles)'),
  ('dealership.edit',   'Edit dealership profile/settings'),
  ('inventory.write',   'Create/update dealership vehicles'),
  ('inventory.publish', 'Publish dealership inventory'),
  ('analytics.view',    'View dealership analytics')
on conflict (key) do nothing;

-- ============================================================================
-- 4) Seed role → permission defaults
--   Mirrors the intent of your current rbac.ts role map.
-- ============================================================================

-- General Manager: full access
insert into public.dealer_role_permissions(role, permission_key)
select 'general_manager', key
from public.dealer_permissions
on conflict do nothing;

-- Sales Manager: everything except dealership.edit (tweak if you want)
insert into public.dealer_role_permissions(role, permission_key) values
  ('sales_manager','invite.create'),
  ('sales_manager','invite.revoke'),
  ('sales_manager','team.view'),
  ('sales_manager','team.manage'),
  ('sales_manager','inventory.write'),
  ('sales_manager','inventory.publish'),
  ('sales_manager','analytics.view')
on conflict do nothing;

-- Finance Manager: view-only + inventory write if you truly want it
insert into public.dealer_role_permissions(role, permission_key) values
  ('finance_manager','team.view'),
  ('finance_manager','inventory.write'),
  ('finance_manager','analytics.view')
on conflict do nothing;

-- Salesperson: basic
insert into public.dealer_role_permissions(role, permission_key) values
  ('salesperson','team.view'),
  ('salesperson','inventory.write')
on conflict do nothing;
