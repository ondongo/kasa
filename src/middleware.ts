import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Middleware qui s'exécute après vérification de l'auth
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // L'utilisateur est autorisé s'il a un token JWT
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/incomes/:path*',
    '/expenses/:path*',
    '/investments/:path*',
    '/settings/:path*',
  ],
};

