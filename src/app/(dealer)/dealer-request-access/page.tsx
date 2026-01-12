import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RequestAccessForm from './RequestAccessForm';

export default async function DealerRequestAccessPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/dealer-login');
  }

  const { data: memberships } = await supabase
    .from('dealer_memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (memberships && memberships.length > 0) {
    redirect('/dealer');
  }

  const { data: existingRequest } = await supabase
    .from('dealer_access_requests')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .maybeSingle();

  if (existingRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          You already have a pending access request. Please wait for approval.
        </p>
      </div>
    );
  }

  return <RequestAccessForm userId={user.id} initialEmail={user.email ?? ''} />;
}
