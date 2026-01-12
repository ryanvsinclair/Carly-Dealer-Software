-- ============================================================================
-- DEALER RBAC RLS ENFORCEMENT
-- ============================================================================
-- Replaces "any active dealer member" with role-gated permissions for:
--   - Invitations (general_manager, sales_manager)
--   - Team management (general_manager, sales_manager)
--   - Self-escalation prevention (safety lock)
-- ============================================================================

-- ============================================================================
-- 1. FIX dealer_invitations INSERT
-- ============================================================================

drop policy if exists "Dealer staff can create invitations" on public.dealer_invitations;

create policy "Dealer managers can create invitations"
on public.dealer_invitations
for insert
to authenticated
with check (
  public.is_active_dealer_member(dealership_id)
  and public.can_dealer_invite(dealership_id)
  and invited_by = auth.uid()
  and status = 'pending'
);

-- ============================================================================
-- 2. FIX dealer_invitations UPDATE (revoke / expire)
-- ============================================================================

drop policy if exists "Dealer staff can revoke invitations" on public.dealer_invitations;

create policy "Dealer managers can update invitations"
on public.dealer_invitations
for update
to authenticated
using (
  public.is_active_dealer_member(dealership_id)
  and public.can_dealer_invite(dealership_id)
)
with check (
  public.is_active_dealer_member(dealership_id)
  and public.can_dealer_invite(dealership_id)
  and status in ('pending', 'revoked', 'expired', 'accepted')
);

-- ============================================================================
-- 3. ADD RBAC to dealer_memberships UPDATE (team management)
-- ============================================================================

create policy "Dealer managers can manage team members"
on public.dealer_memberships
for update
to authenticated
using (
  public.can_manage_dealer_team(dealership_id)
)
with check (
  public.can_manage_dealer_team(dealership_id)
);

-- ============================================================================
-- 4. PREVENT self-escalation (safety lock)
-- ============================================================================

create policy "Users cannot modify their own membership"
on public.dealer_memberships
for update
to authenticated
using (
  user_id != auth.uid()
)
with check (
  user_id != auth.uid()
);

-- ============================================================================
-- 5. RESTRICT direct SELECT to self-only
-- ============================================================================
-- Team access MUST go through the get_dealer_team() RPC.
-- This prevents:
--   - Data leaks
--   - Enumeration attacks
--   - Cross-tenant joins
--
-- Users can only SELECT their own membership record directly.
-- All team viewing goes through the controlled RPC window.
-- ============================================================================

drop policy if exists "Users can view own membership" on public.dealer_memberships;

create policy "Users can view own membership"
on public.dealer_memberships
for select
to authenticated
using (
  user_id = auth.uid()
);
