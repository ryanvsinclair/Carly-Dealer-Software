-- ============================================================================
-- Generic permission check for any user
-- ============================================================================

create or replace function public.has_dealer_permission(
  p_user_id uuid,
  p_dealership_id uuid,
  p_permission text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.dealer_memberships m
    join public.dealer_role_permissions rp
      on rp.role = m.role
    where m.user_id = p_user_id
      and m.dealership_id = p_dealership_id
      and m.is_active = true
      and rp.permission_key = p_permission
  );
$$;

revoke all on function public.has_dealer_permission(uuid, uuid, text) from public;
grant execute on function public.has_dealer_permission(uuid, uuid, text) to authenticated;

-- ============================================================================
-- Convenience wrapper for current user
-- ============================================================================

create or replace function public.has_my_dealer_permission(
  p_dealership_id uuid,
  p_permission text
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_dealer_permission(auth.uid(), p_dealership_id, p_permission);
$$;

revoke all on function public.has_my_dealer_permission(uuid, text) from public;
grant execute on function public.has_my_dealer_permission(uuid, text) to authenticated;

-- ============================================================================
-- Optional: return current user's permission list for a dealership
-- Useful for getDealerContext hydration
-- ============================================================================

create or replace function public.get_my_dealer_permissions(
  p_dealership_id uuid
)
returns table(permission_key text)
language sql
stable
security definer
set search_path = public
as $$
  select rp.permission_key
  from public.dealer_memberships m
  join public.dealer_role_permissions rp on rp.role = m.role
  where m.user_id = auth.uid()
    and m.dealership_id = p_dealership_id
    and m.is_active = true;
$$;

revoke all on function public.get_my_dealer_permissions(uuid) from public;
grant execute on function public.get_my_dealer_permissions(uuid) to authenticated;
