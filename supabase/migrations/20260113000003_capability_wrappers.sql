-- ============================================================================
-- Backward-compatible wrappers for existing capability functions
-- These allow incremental migration without breaking existing RPCs
-- ============================================================================

-- inventory.publish permission
create or replace function public.can_publish_inventory(p_dealership_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_my_dealer_permission(p_dealership_id, 'inventory.publish');
$$;

-- team.manage permission
create or replace function public.can_manage_dealer_team(p_dealership_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_my_dealer_permission(p_dealership_id, 'team.manage');
$$;

-- dealership.edit permission
create or replace function public.can_manage_dealership(p_dealership_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_my_dealer_permission(p_dealership_id, 'dealership.edit');
$$;

-- invite.create permission
create or replace function public.can_dealer_invite(p_dealership_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_my_dealer_permission(p_dealership_id, 'invite.create');
$$;
