import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DealerRootPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/dealer-login');
  }

  const { data: memberships, error } = await supabase
    .from('dealer_memberships')
    .select('dealership_id')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (error || !memberships || memberships.length === 0) {
    redirect('/dealer-request-access');
  }

  if (memberships.length === 1) {
    redirect(`/dealer/${memberships[0].dealership_id}`);
  }

  redirect('/dealer-select');
}
