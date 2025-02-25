import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This minimal middleware only provides a safety net
// Most authentication logic will be in client-side layouts
export function middleware(request: NextRequest) {
  // Allow all requests to proceed
  // Auth checks will be handled by the layout components
  return NextResponse.next();
}

// Keep matcher for potential future use, but don't restrict any routes
export const config = {
  matcher: []
};