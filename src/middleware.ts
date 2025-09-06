import { NextResponse, NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/favicon.ico',
  '/_next',
  '/api'
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const hasSession = Boolean(req.cookies.get('wms_uid')?.value);

  if (!isPublic && !hasSession) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)'],
};
