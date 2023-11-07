import GitHub from '@auth/core/providers/github';
import type { DefaultSession } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';

import { db, eq, schema, tableCreator } from '@cs/database';
import { sessions, users } from '@cs/database/schema/auth';

export type { Session } from 'next-auth';

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session {
    user: {
      id: string;
      contactId?: number;
    } & DefaultSession['user'];
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface User {
    contactId?: number;
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
      return (await db
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) => res[0] ?? null)) as any;
    },
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  events: {
    createUser: async (message) => {
      const newContact = await db
        .insert(schema.contacts)
        .values({
          name: message.user.name,
          email: message.user.email,
          avatarUrl: message.user.image,
          userId: message.user.id,
        })
        .returning({ id: schema.contacts.id })
        .then((res) => res?.[0] ?? null);

      await db
        .update(schema.users)
        .set({
          contactId: newContact?.id,
        })
        .where(eq(schema.users.id, message.user.id));
    },
  },
  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        contactId: user.contactId,
      },
    }),

    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
