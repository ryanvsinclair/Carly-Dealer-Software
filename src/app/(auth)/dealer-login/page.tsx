import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { DealerLoginForm } from './DealerLoginForm';

export default async function DealerLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const supabase = createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && searchParams.next) {
    redirect(searchParams.next);
  }

  return <DealerLoginForm next={searchParams.next} />;
}
