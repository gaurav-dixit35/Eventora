import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes: Record<string, string | undefined> = {
  '/dashboard': undefined,
  '/organizer': 'ORGANIZER',
  '/admin': 'ADMIN',
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const requiredRole = Object.entries(protectedRoutes).find(([route]) =>
    request.nextUrl.pathname.startsWith(route),
  )?.[1];
  const cookie = request.headers.get('cookie');
  if (!cookie)
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url),
    );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
  const response = await fetch(`${apiUrl}/auth/me`, { headers: { cookie }, cache: 'no-store' });
  if (!response.ok)
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url),
    );
  const body = (await response.json()) as { user: { roles: string[] } };
  if (requiredRole && !body.user.roles.includes(requiredRole))
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/organizer/:path*', '/admin/:path*'] };
