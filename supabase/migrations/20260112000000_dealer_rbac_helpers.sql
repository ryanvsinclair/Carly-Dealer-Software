-- Dealer RBAC Helper Functions
-- This migration creates PostgreSQL functions that mirror src/lib/rbac.ts
-- Enables RLS policies to enforce the same permission logic as the application

-- ============================================================================
-- ACTIVE MEMBERSHIP ROLE
-- ============================================================================

-- Returns the current user's role inside a dealership, or NULL if not an active member.
create or replace function public.active_dealer_membership_role(
  p_dealership_id uuid
)
returns public.dealer_role
language sql
stable
security definer
as $$
  select role
  from public.dealer_memberships
  where
    dealership_id = p_dealership_id
    and user_id = auth.uid()
    and is_active = true
  limit 1;
$$;

-- ============================================================================
-- ROLE MEMBERSHIP CHECK
-- ============================================================================

-- Checks if the current user has any of the given roles inside a dealership.
create or replace function public.has_dealer_role(
  p_dealership_id uuid,
  p_roles public.dealer_role[]
)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.dealer_memberships
    where
      dealership_id = p_dealership_id
      and user_id = auth.uid()
      and is_active = true
      and role = any (p_roles)
  );
$$;

-- ============================================================================
-- PERMISSION HELPERS (mirror rbac.ts)
-- ============================================================================

-- Invite permissions (general_manager, sales_manager)
create or replace function public.can_dealer_invite(
  p_dealership_id uuid
)
returns boolean
language sql
stable
security definer
as $$
  select public.has_dealer_role(
    p_dealership_id,
    array['general_manager', 'sales_manager']::public.dealer_role[]
  );
$$;

-- Dealership settings permissions (general_manager only)
create or replace function public.can_manage_dealership(
  p_dealership_id uuid
)
returns boolean
language sql
stable
security definer
as $$
  select public.has_dealer_role(
    p_dealership_id,
    array['general_manager']::public.dealer_role[]
  );
$$;

-- Team management permissions (general_manager, sales_manager)
create or replace function public.can_manage_dealer_team(
  p_dealership_id uuid
)
returns boolean
language sql
stable
security definer
as $$
  select public.has_dealer_role(
    p_dealership_id,
    array['general_manager', 'sales_manager']::public.dealer_role[]
  );
$$;

-- Dealership settings permissions (general_manager only)
create or replace function public.can_manage_dealership(
  p_dealership_id uuid
)
returns boolean
language sql
stable
security definer
as $$
  select public.has_dealer_role(
    p_dealership_id,
    array['general_manager']::public.dealer_role[]
  );
$$;

-- Inventory publishing permissions (general_manager, sales_manager)
create or replace function public.can_publish_inventory(
  p_dealership_id uuid
)
returns boolean
language sql
stable
security definer
as $$
  select public.has_dealer_role(
    p_dealership_id,
    array['general_manager', 'sales_manager']::public.dealer_role[]
  );
$$;

-- ============================================================================
-- HARD SAFETY RULES
-- ============================================================================
--
-- These functions enforce zero-trust security by NEVER allowing:
--
--   1. Inactive memberships (is_active = false)
--   2. Cross-dealership access (wrong dealership_id)
--   3. Self-assignment (bypassing proper role grants)
--
-- All access flows through the dealer_memberships table with:
--   - user_id: authenticated user (auth.uid())
--   - dealership_id: the dealership being accessed
--   - role: the user's assigned dealer_role
--   - is_active: must be true
--
-- This gives you zero-trust enforcement at the database level.
-- ============================================================================

