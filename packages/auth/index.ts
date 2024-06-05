import GitHub from '@auth/core/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';

import { drizzleConnection, schema } from '@cs/database';
import type { User } from '@cs/kyaku/models';

export type { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      emailVerified: Date | null;
    } & User;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: {
    ...DrizzleAdapter(drizzleConnection, {
      usersTable: schema.users,
      accountsTable: schema.accounts,
      sessionsTable: schema.sessions,
      verificationTokensTable: schema.verificationTokens,
    }),
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    session: (opts) => {
      if (!('user' in opts))
        throw new Error('unreachable with session strategy');

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
});
