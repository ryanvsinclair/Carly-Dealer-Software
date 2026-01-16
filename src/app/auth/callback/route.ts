import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dealer";

  if (!code) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  const supabase = createSupabaseServer();

  // 1️⃣ Exchange magic-link code for session
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    // Fail closed — no partial users
    return NextResponse.redirect(new URL("/dealer-login", request.url));
  }

  // 2️⃣ Load authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.redirect(new URL("/dealer-login", request.url));
  }

  // 3️⃣ Ensure profiles row exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    // Create profile
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: "dealer",
    });
  } else if (!existingProfile.email) {
    // Backfill email if missing
    await supabase
      .from("profiles")
      .update({ email: user.email })
      .eq("id", user.id);
  }

  // 4️⃣ Continue invite flow
  return NextResponse.redirect(new URL(next, request.url));
}
