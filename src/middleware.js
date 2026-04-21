import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect routes starting with /admin, but EXCLUDE /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = request.cookies.get('admin_session');

    if (!session || session.value !== 'authenticated_true') {
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
