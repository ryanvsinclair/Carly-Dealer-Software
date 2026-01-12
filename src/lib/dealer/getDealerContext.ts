import { createSupabaseServer } from '@/lib/supabase/server';
import { getPermissions, type DealerRole, type DealerPermission } from '@/lib/rbac';
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

  const { data: membership } = await supabase
    .from('dealer_memberships')
    .select(`
      id,
      role,
      is_active,
      dealerships (
        id,
        name,
        city,
        province_code,
        logo_url,
        dealer_group_id,
        account_status
      )
    `)
    .eq('user_id', user.id)
    .eq('dealership_id', dealershipId)
    .eq('is_active', true)
    .maybeSingle();

  if (!membership || !membership.dealerships) {
    throw new Error('Unauthorized dealership access');
  }

  const dealership = membership.dealerships;
  const role = membership.role as DealerRole;
  const permissions = getPermissions(role);

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
      role,
      is_active: membership.is_active,
    },
    permissions,
  };
}
