-- RPC: create_dealer_vehicle
-- Creates a new vehicle in draft state for a specific dealership
-- Only accessible by authenticated dealer members

CREATE OR REPLACE FUNCTION create_dealer_vehicle(
  p_dealership_id uuid,
  p_vin text,
  p_year integer,
  p_make text,
  p_model text,
  p_trim text,
  p_mileage integer,
  p_price numeric,
  p_description text
)
RETURNS TABLE (
  id uuid,
  owner_type text,
  owner_dealership_id uuid,
  owner_profile_id uuid,
  vin text,
  year integer,
  make text,
  model text,
  trim text,
  mileage integer,
  price numeric,
  description text,
  publish_status text,
  sale_status text,
  created_by uuid,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_vehicle_id uuid;
BEGIN
  -- Verify caller is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized: Authentication required';
  END IF;

  -- Verify caller has membership to this dealership
  IF NOT EXISTS (
    SELECT 1
    FROM dealer_memberships
    WHERE dealership_id = p_dealership_id
      AND user_id = auth.uid()
      AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Not a member of this dealership';
  END IF;

  -- Insert the vehicle
  INSERT INTO vehicles (
    owner_type,
    owner_dealership_id,
    owner_profile_id,
    vin,
    year,
    make,
    model,
    trim,
    mileage,
    price,
    description,
    publish_status,
    sale_status,
    created_by
  )
  VALUES (
    'dealer',
    p_dealership_id,
    NULL,
    p_vin,
    p_year,
    p_make,
    p_model,
    p_trim,
    p_mileage,
    p_price,
    p_description,
    'draft',
    'available',
    auth.uid()
  )
  RETURNING vehicles.id INTO v_new_vehicle_id;

  -- Return the newly created vehicle
  RETURN QUERY
  SELECT
    v.id,
    v.owner_type,
    v.owner_dealership_id,
    v.owner_profile_id,
    v.vin,
    v.year,
    v.make,
    v.model,
    v.trim,
    v.mileage,
    v.price,
    v.description,
    v.publish_status,
    v.sale_status,
    v.created_by,
    v.created_at,
    v.updated_at
  FROM vehicles v
  WHERE v.id = v_new_vehicle_id;
END;
$$;
