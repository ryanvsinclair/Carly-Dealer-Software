import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DealerInvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 bg-white dark:bg-[#171717] border-[#E5E5E5] dark:border-[#262626]">
          <h1 className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA] mb-4">
            Invalid Invite
          </h1>
          <p className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA] mb-6">
            No invitation token provided. Please check your invite link and try
            again.
          </p>
          <Link href="/dealer-login">
            <Button className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white w-full">
              Go to Login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const supabase = createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/dealer-login?next=/dealer-invite?token=${token}`);
  }

  // Attempt to accept the invite
  const { data: dealershipId, error } = await supabase.rpc(
    'accept_dealer_invite',
    { invite_token: token }
  );

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 bg-white dark:bg-[#171717] border-[#E5E5E5] dark:border-[#262626]">
          <h1 className="text-[28px] font-bold text-[#171717] dark:text-[#FAFAFA] mb-4">
            Unable to Accept Invite
          </h1>
          <p className="text-[14px] font-light text-[#171717] dark:text-[#FAFAFA] mb-6">
            {error.message || 'An error occurred while accepting the invitation.'}
          </p>
          <Link href="/dealer-select">
            <Button className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white w-full">
              Go to Dealership Selection
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Success - redirect to the dealership
  redirect(`/dealer/${dealershipId}`);
}
