import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest, verifyAdminSessionValue } from '@/lib/auth-server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    const session = getAdminSessionFromRequest(request);
    if (await verifyAdminSessionValue(session)) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const session = getAdminSessionFromRequest(request);
    if (!(await verifyAdminSessionValue(session))) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
