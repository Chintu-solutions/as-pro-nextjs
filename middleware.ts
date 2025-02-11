import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from session
  const token = request.cookies.get('token')?.value;
  
  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!token && !pathname.startsWith('/admin/auth/')) {
      return NextResponse.redirect(new URL('/admin/auth/login', request.url));
    }
  }
  
  // Publisher routes protection
  if (pathname.startsWith('/publisher') && !pathname.startsWith('/publisher/auth/')) {
    if (!token) {
      return NextResponse.redirect(new URL('/publisher/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/:path*',
  ],
};