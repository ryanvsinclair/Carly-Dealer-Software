-- ============================================================================
-- GET MY DEALERSHIPS RPC
-- ============================================================================
-- Provides a single authoritative API for loading user's dealerships with:
--   - Role information
--   - Active membership filtering
--   - No direct table access (prevents enumeration)
--
-- Used by:
--   - /dealer-select
--   - Future dealership switcher
--   - Analytics filtering
-- ============================================================================

create or replace function public.get_my_dealerships()
returns table (
  dealership_id uuid,
  name text,
  logo_url text,
  city text,
  province_code text,
  role public.dealer_role
)
language sql
security definer
stable
as $$
  -- Only return dealerships where the user is an active member
  select
    d.id as dealership_id,
    d.name,
    d.logo_url,
    d.city,
    d.province_code,
    m.role
  from public.dealerships d
  join public.dealer_memberships m on m.dealership_id = d.id
  where
    m.user_id = auth.uid()
    and m.is_active = true
  order by d.name asc;
$$;
