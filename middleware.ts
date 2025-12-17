import { NextResponse } from 'next/server'

// Middleware disabled - auth handled in pages directly
export async function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
