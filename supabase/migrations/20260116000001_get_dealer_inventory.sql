-- RPC: get_dealer_inventory
-- Returns all vehicles for a specific dealership (including drafts)
-- Only accessible by authenticated dealer members

CREATE OR REPLACE FUNCTION get_dealer_inventory(p_dealership_id uuid)
RETURNS TABLE (
  id uuid,
  year integer,
  make text,
  model text,
  trim text,
  price numeric,
  publish_status text,
  sale_status text,
  updated_at timestamptz,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify caller has membership to this dealership
  IF NOT EXISTS (
    SELECT 1
    FROM dealer_memberships
    WHERE dealership_id = p_dealership_id
      AND user_id = auth.uid()
      AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  RETURN QUERY
  SELECT
    v.id,
    v.year,
    v.make,
    v.model,
    v.trim,
    v.price,
    v.publish_status,
    v.sale_status,
    v.updated_at,
    v.created_at
  FROM vehicles v
  WHERE
    v.owner_type = 'dealer'
    AND v.owner_dealership_id = p_dealership_id
  ORDER BY v.updated_at DESC;
END;
$$;
