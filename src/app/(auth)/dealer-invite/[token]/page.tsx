import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AcceptInvitePage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = await createClient();

  const { data: invite } = await supabase
    .from("dealer_invitations")
    .select("id, email, dealership_id, role, status, expires_at")
    .eq("token", params.token)
    .single();

  if (!invite || invite.status !== "pending") {
    return <div className="p-8">This invitation is no longer valid.</div>;
  }

  if (new Date(invite.expires_at) < new Date()) {
    return <div className="p-8">This invitation has expired.</div>;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → go to dealer login with return token
  if (!user) {
    redirect(`/dealer-login?invite=${params.token}`);
  }

  // Must match invited email
  if (user.email !== invite.email) {
    return (
      <div className="p-8">
        You must sign in with <b>{invite.email}</b> to accept this invite.
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";

        const supabase = await createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("Not authenticated");

        // Create dealership membership
        await supabase.from("dealer_memberships").insert({
          user_id: user.id,
          dealership_id: invite.dealership_id,
          role: invite.role,
          is_active: true,
        });

        // Mark invite accepted
        await supabase
          .from("dealer_invitations")
          .update({
            status: "accepted",
            accepted_at: new Date().toISOString(),
            accepted_by: user.id,
          })
          .eq("id", invite.id);

        redirect("/dealer");
      }}
      className="p-8 max-w-md mx-auto space-y-6"
    >
      <h1 className="text-xl font-semibold">Accept dealership invitation</h1>

      <p>
        You are being invited as <b>{invite.role}</b>.
      </p>

      <button
        type="submit"
        className="w-full py-2 rounded bg-primary text-primary-foreground"
      >
        Accept Invitation
      </button>
    </form>
  );
}
