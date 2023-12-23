import { AdapterUser } from '@auth/core/adapters';
import GitHub from '@auth/core/providers/github';
import { Session } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';

import { db, tableCreator } from '@cs/database';
import { User } from '@cs/lib/users';

export type { Session } from 'next-auth';

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session {
    user: User;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: {
    ...DrizzleAdapter(db, tableCreator),
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    session: (params) => ({
      ...params.session,
      user: {
        id: 'user' in params ? params.user.id : '',
        name: 'user' in params ? params.user.name : null,
        email: 'user' in params ? params.user.email : '',
        image: 'user' in params ? params.user.image : null,
      },
    }),

    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
