-- publish_dealer_vehicle: Mark a vehicle as published (dealer only)
-- Enforces inventory.publish permission using the new RBAC system
create or replace function public.publish_dealer_vehicle(p_vehicle_id uuid)
returns table(id uuid, publish_status public.vehicle_publish_status, updated_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dealership_id uuid;
begin
  select owner_dealership_id
  into v_dealership_id
  from public.vehicles
  where id = p_vehicle_id
    and owner_type = 'dealer';

  if v_dealership_id is null then
    raise exception 'Vehicle not found or not dealer owned';
  end if;

  if not public.has_my_dealer_permission(v_dealership_id, 'inventory.publish') then
    raise exception 'You do not have permission to publish inventory';
  end if;

  update public.vehicles
  set publish_status = 'published',
      updated_at = now()
  where id = p_vehicle_id
  returning id, publish_status, updated_at
  into id, publish_status, updated_at;

  return next;
end;
$$;
