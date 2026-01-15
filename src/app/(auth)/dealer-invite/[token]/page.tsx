import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token || !/^[0-9a-f-]{36}$/i.test(token)) {
    return <div className="p-8">Invalid invitation link.</div>;
  }

  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → redirect with encoded next
  if (!user) {
    const next = encodeURIComponent(`/dealer-invite?token=${token}`);
    redirect(`/dealer-login?next=${next}`);
  }

  // Accept invite atomically
  const { data, error } = await supabase.rpc("accept_dealer_invite", {
    invite_token: token,
  });

  if (error) {
    return <div className="p-8">{error.message}</div>;
  }

  redirect(`/dealer/${data.dealership_id}`);
}
