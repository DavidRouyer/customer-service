import { AdapterUser } from '@auth/core/adapters';
import GitHub from '@auth/core/providers/github';
import { Session } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';

import { db, eq, tableCreator } from '@cs/database';
import { sessions, users } from '@cs/database/schema/auth';
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
    // TODO: remove hack when https://github.com/nextauthjs/next-auth/pull/8561 is released
    async getSessionAndUser(data) {
      return await db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) => res[0] ?? null);
    },
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
