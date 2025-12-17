import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check for any Supabase auth-related cookies
  const cookies = request.cookies.getAll()
  const hasAuthCookie = cookies.some(cookie => 
    cookie.name.startsWith('sb-') || 
    cookie.name.includes('supabase')
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
