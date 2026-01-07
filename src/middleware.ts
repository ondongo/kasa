import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
  });

  // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
  if (!token) {
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }

  // L'utilisateur est authentifié, on le laisse passer
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/incomes/:path*',
    '/expenses/:path*',
    '/investments/:path*',
    '/settings/:path*',
    '/pricing/:path*',
    '/tontines/:path*',
  ],
};

