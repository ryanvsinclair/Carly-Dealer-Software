import { createSupabaseServer } from '@/lib/supabase/server';

export async function getDealerContext(dealershipId: string) {
  const supabase = createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: membership } = await supabase
    .from('dealer_memberships')
    .select(`
      id,
      role,
      dealerships (
        id,
        name,
        city,
        province_code,
        logo_url,
        dealer_group_id
      )
    `)
    .eq('user_id', user.id)
    .eq('dealership_id', dealershipId)
    .eq('is_active', true)
    .maybeSingle();

  if (!membership || !membership.dealerships) {
    throw new Error('Unauthorized dealership access');
  }

  return {
    user,
    membership,
    dealership: membership.dealerships,
  };
}
