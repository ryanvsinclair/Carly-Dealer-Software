import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request)

  const url = request.nextUrl
  const pathname = url.pathname

  // Only protect /dealer routes
  if (!pathname.startsWith('/dealer')) {
    return response
  }

  // Allow public dealer entry routes
  const publicDealerRoutes = [
    '/dealer',
    '/dealer-login',
    '/dealer-select',
    '/dealer-request-access'
  ]

  if (publicDealerRoutes.includes(pathname)) {
    return response
  }

  // Extract dealershipId from /dealer/[dealershipId]/...
  const parts = pathname.split('/').filter(Boolean)
  const dealershipId = parts[1]

  // If no dealershipId, let gateway handle it
  if (!dealershipId) {
    return response
  }

  // Validate user session
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const nextPath = request.nextUrl.pathname + request.nextUrl.search;
    const loginUrl = new URL('/dealer-login', request.url);
    loginUrl.searchParams.set('next', nextPath);
    return NextResponse.redirect(loginUrl);
  }

  // Validate active membership
  const { data: membership } = await supabase
    .from('dealer_memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('dealership_id', dealershipId)
    .eq('is_active', true)
    .maybeSingle()

  if (!membership) {
    const gatewayUrl = new URL('/dealer', request.url)
    return NextResponse.redirect(gatewayUrl)
  }

  return response
}

export const config = {
  matcher: ['/dealer/:path*'],
}
