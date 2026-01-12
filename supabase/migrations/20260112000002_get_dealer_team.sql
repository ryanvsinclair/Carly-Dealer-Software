-- ============================================================================
-- DEALER TEAM RPC
-- ============================================================================
-- Provides a single authoritative API for loading dealership staff with:
--   - Roles
--   - Profile info
--   - RBAC safety enforcement
--
-- Used by:
--   - /dealer/[dealershipId]/team
--   - Invite list
--   - Future audits
--   - Admin tooling
-- ============================================================================

create or replace function public.get_dealer_team(
  p_dealership_id uuid
)
returns table (
  membership_id uuid,
  user_id uuid,
  role public.dealer_role,
  is_active boolean,
  name text,
  email text,
  phone_number text,
  created_at timestamptz
)
language sql
security definer
stable
as $$
  -- Only active dealer members may view the team
  select
    m.id as membership_id,
    m.user_id,
    m.role,
    m.is_active,
    p.name,
    p.email,
    p.phone_number,
    m.created_at
  from public.dealer_memberships m
  join public.profiles p on p.id = m.user_id
  where
    m.dealership_id = p_dealership_id
    and public.is_active_dealer_member(p_dealership_id);
$$;
