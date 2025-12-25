import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/incomes/:path*',
    '/expenses/:path*',
    '/investments/:path*',
    '/settings/:path*',
  ],
};

