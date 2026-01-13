import { createSupabaseServer } from '@/lib/supabase/server';
import type { DealerRole, DealerPermission } from '@/lib/rbac';
import type { User } from '@supabase/supabase-js';

// ============================================================================
// CONTEXT TYPE
// ============================================================================

export interface DealerContext {
  user: User;
  dealership: {
    id: string;
    name: string;
    logo_url: string | null;
    city: string | null;
    province_code: string | null;
    account_status: string;
  };
  membership: {
    role: DealerRole;
    is_active: boolean;
  };
  permissions: DealerPermission[];
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function getDealerContext(dealershipId: string): Promise<DealerContext> {
  const supabase = createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 1. Get dealership
  const { data: dealership, error: dealershipError } = await supabase
    .from('dealerships')
    .select('*')
    .eq('id', dealershipId)
    .single();

  if (dealershipError || !dealership) {
    throw new Error('Dealership not found');
  }

  // 2. Get membership
  const { data: membership, error: membershipError } = await supabase
    .from('dealer_memberships')
    .select('role, is_active')
    .eq('dealership_id', dealershipId)
    .eq('user_id', user.id)
    .single();

  if (membershipError || !membership || !membership.is_active) {
    throw new Error('Not an active dealer member');
  }

  // 3. Get live permissions from DB
  type GetMyDealerPermissionsArgs = {
    p_dealership_id: string;
  };

  type PermissionRow = {
    permission_key: string;
  };

  const { data: perms, error: permsError } = await supabase.rpc(
    'get_my_dealer_permissions',
    { p_dealership_id: dealershipId }
  );

  if (permsError) {
    throw new Error('Failed to load permissions');
  }

  const permissions = (perms ?? []).map((p) => p.permission_key);

  return {
    user,
    dealership: {
      id: dealership.id,
      name: dealership.name,
      logo_url: dealership.logo_url,
      city: dealership.city,
      province_code: dealership.province_code,
      account_status: dealership.account_status,
    },
    membership: {
      role: membership.role as DealerRole,
      is_active: membership.is_active,
    },
    permissions,
  };
}
