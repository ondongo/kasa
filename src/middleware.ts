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

  // Vérifier si l'utilisateur a un numéro de téléphone configuré
  // Le token JWT est mis à jour à chaque requête via le callback jwt() dans auth.ts
  // Mais pour être sûr, on vérifie aussi si le token a été récemment mis à jour
  const phoneNumber = token.phoneNumber as string | null | undefined;
  
  // Vérifier si le phoneNumber vient d'être vérifié (cookie temporaire)
  const phoneJustVerified = req.cookies.get('phone-just-verified')?.value === 'true';
  
  // Si pas de numéro de téléphone et que ce n'est pas déjà la page settings/login
  // ET que ce n'est pas une requête API (pour éviter les boucles)
  // ET que le phoneNumber n'a pas été vérifié récemment
  if (
    !phoneNumber && 
    !phoneJustVerified &&
    !req.nextUrl.pathname.startsWith('/settings') && 
    !req.nextUrl.pathname.startsWith('/login') &&
    !req.nextUrl.pathname.startsWith('/api')
  ) {
    const url = new URL('/login', req.url);
    url.searchParams.set('step', 'phone');
    if (token.email) {
      url.searchParams.set('email', token.email as string);
    }
    return NextResponse.redirect(url);
  }
  
  // Si le phoneNumber vient d'être vérifié, supprimer le cookie après la première requête
  // et forcer une mise à jour du token en ajoutant un header
  if (phoneJustVerified) {
    const response = NextResponse.next();
    response.cookies.delete('phone-just-verified');
    return response;
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

