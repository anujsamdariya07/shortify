// PRotect routes by checking if a user is authenticated before allowing access

import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth (
  function middleware() {
    // Allow the request to continue
    return NextResponse.next();
  },
  {
    callbacks: {
      // Access control
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Following routes will always be reachable
        if (
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/login') ||
          pathname.startsWith('/register')
        ) {
          return true;
        }

        if (pathname === '/' || pathname.startsWith('/api/videos')) {
          return true;
        }

        // For others check if the user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};
