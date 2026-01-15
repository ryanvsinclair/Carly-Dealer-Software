import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ALWAYS create Supabase + response first
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // 🚫 Allow auth + invite routes to pass through
  if (
    pathname.startsWith("/dealer-login") ||
    pathname.startsWith("/dealer-invite") ||
    pathname.startsWith("/dealer-invite-test") ||
    pathname.startsWith("/dealer-request-access")
  ) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const nextPath = request.nextUrl.pathname + request.nextUrl.search;
    const loginUrl = new URL("/dealer-login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/dealer/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
