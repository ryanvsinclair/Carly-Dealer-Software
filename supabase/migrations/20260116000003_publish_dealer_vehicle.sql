-- publish_dealer_vehicle: Mark a vehicle as published (dealer only)
CREATE OR REPLACE FUNCTION publish_dealer_vehicle(p_vehicle_id uuid)
RETURNS TABLE(
  id uuid,
  publish_status text,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vehicle_dealership_id uuid;
BEGIN
  -- Verify authentication
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get vehicle's owner_dealership_id
  SELECT v.owner_dealership_id
  INTO v_vehicle_dealership_id
  FROM vehicles v
  WHERE v.id = p_vehicle_id
    AND v.owner_type = 'dealer';

  IF v_vehicle_dealership_id IS NULL THEN
    RAISE EXCEPTION 'Vehicle not found or not a dealer vehicle';
  END IF;

  -- Verify active membership using RBAC helper
  IF NOT is_active_dealer_member(v_vehicle_dealership_id) THEN
    RAISE EXCEPTION 'Not an active member of this dealership';
  END IF;

  -- Check permission using RBAC helper
  IF NOT can_publish_inventory(v_vehicle_dealership_id) THEN
    RAISE EXCEPTION 'Permission denied: can_publish_inventory required';
  END IF;

  -- Update vehicle
  UPDATE vehicles
  SET 
    publish_status = 'published',
    updated_at = now()
  WHERE vehicles.id = p_vehicle_id;

  -- Return updated row
  RETURN QUERY
  SELECT 
    vehicles.id,
    vehicles.publish_status,
    vehicles.updated_at
  FROM vehicles
  WHERE vehicles.id = p_vehicle_id;
END;
$$;
