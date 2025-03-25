import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

// Create an API route handler using the settings from authOptions
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
