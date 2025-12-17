import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check for Supabase auth cookies (simplified check for Edge Runtime)
  // The actual auth validation happens in the page/route
  const hasAuthCookie = request.cookies.getAll().some(
    cookie => cookie.name.includes('supabase') && cookie.name.includes('auth')
  )

  // Protected routes - require auth cookie
  if (request.nextUrl.pathname.startsWith('/tool')) {
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/login') {
    if (hasAuthCookie) {
      return NextResponse.redirect(new URL('/tool', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/tool/:path*', '/login'],
}
