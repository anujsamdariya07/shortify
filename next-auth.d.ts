// For preventing ts errors when accessing custom session fields

import { DefaultSession } from 'next-auth';

// Declare a module augmentation to extend the existing next-auth types instead of overriding them
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
    // DefaultSession by default has three fields: name, email, and image
    // DefaultSession['user'] will add the above mentioned id field
  }
}
