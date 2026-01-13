import { createSupabaseServer } from "@/lib/supabase/server";

export default function DealerRequestAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        action={async (formData) => {
          "use server";

          const supabase = createSupabaseServer();

          await supabase.from("dealer_access_requests").insert({
            full_name: formData.get("full_name"),
            email: formData.get("email"),
            dealer_role: formData.get("dealer_role"),
            website: formData.get("website"),
          });
        }}
        className="w-full max-w-md p-8 border rounded-lg bg-card space-y-6"
      >
        <h1 className="text-2xl font-semibold">Request Dealer Access</h1>

        <input name="full_name" required placeholder="Full name" className="w-full p-3 border rounded" />
        <input name="email" type="email" required placeholder="Work email" className="w-full p-3 border rounded" />
        <input name="dealer_role" required placeholder="Your role (GM, Owner, etc)" className="w-full p-3 border rounded" />
        <input name="website" required placeholder="Dealership website" className="w-full p-3 border rounded" />

        <button type="submit" className="w-full py-2 rounded bg-primary text-primary-foreground">
          Submit Application
        </button>
      </form>
    </div>
  );
}
