import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbConnect } from './db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // For defining the authentication methods that users can use
  providers: [
    // For manual login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      // Custom function for validating user credentials
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Missing email or password!');
        }

        try {
          await dbConnect();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found!');
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            throw new Error('Invalid Password!');
          }

          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        // store id in JWT making authentication stateless
        token.id = user.id;
      }
      return token;
    },
    // RUns when useSession or getSession is called on the client side
    async session({ session, token }) {
      if (session.user) {
        // Retrieve id from the JWT and add it to session.user to make sure that id is available on the client-side when accessing session data
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    // Use JWT-based authentication instead of database sessions
    strategy: 'jwt',
    // Set the session expiry time to 30 days
    maxAge: 30 * 24 * 60 * 60
  },
  // encrypt and sign tokens for security
  secret: process.env.NEXTAUTH_SECRET
};
