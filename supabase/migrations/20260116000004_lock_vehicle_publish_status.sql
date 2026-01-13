-- ============================================================================
-- Lock down publish_status and sale_status to RPC-only changes
-- ============================================================================

-- Drop the existing dealer UPDATE policy that allows changing all columns
drop policy if exists "vehicles_dealer_update_by_membership" on public.vehicles;

-- Create a new policy that allows dealers to update vehicles EXCEPT publish_status and sale_status
-- This forces publish/sale status changes to go through RPCs with proper permission checks
create policy "Dealer can update vehicle data but not publish"
on public.vehicles
for update
using (
  owner_type = 'dealer'
  and owner_dealership_id in (
    select dealership_id
    from public.dealer_memberships
    where user_id = auth.uid()
      and is_active = true
  )
)
with check (
  owner_type = 'dealer'
  and owner_dealership_id in (
    select dealership_id
    from public.dealer_memberships
    where user_id = auth.uid()
      and is_active = true
  )
  and publish_status = (select publish_status from public.vehicles where id = vehicles.id)
  and sale_status = (select sale_status from public.vehicles where id = vehicles.id)
);

-- Note: Consumer vehicles remain unaffected by this change
-- The existing "vehicles_consumer_update_own" policy continues to work as before
