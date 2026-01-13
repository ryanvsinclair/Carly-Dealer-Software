-- ============================================================================
-- Enforce read visibility using new permission system
-- ============================================================================

-- Drop the existing dealer SELECT policy
drop policy if exists "vehicles_dealer_select_by_membership" on public.vehicles;

-- Create a new policy that requires inventory.write permission to view dealer vehicles
create policy "Dealer can view own dealership vehicles"
on public.vehicles
for select
using (
  owner_type = 'dealer'
  and public.has_my_dealer_permission(owner_dealership_id, 'inventory.write')
);

-- Note: The public policy remains unchanged
-- "vehicles_public_read_published" continues to allow anyone to see published vehicles
