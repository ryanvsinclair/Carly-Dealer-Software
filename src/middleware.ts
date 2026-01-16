import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Explicitly allow invite + auth flows
  if (
    pathname.startsWith('/dealer-invite') ||
    pathname.startsWith('/dealer-invite-auth') ||
    pathname.startsWith('/dealer-login')
  ) {
    return NextResponse.next();
  }

  const { supabase, response } = createSupabaseMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const nextPath = pathname + request.nextUrl.search;
    const loginUrl = new URL('/dealer-login', request.url);
    loginUrl.searchParams.set('next', nextPath);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/dealer/:path*'],
};
