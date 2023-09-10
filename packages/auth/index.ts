import GitHub from '@auth/core/providers/github';
import type { DefaultSession } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';

import { db, eq, schema, tableCreator } from '@cs/database';

export type { Session } from 'next-auth';

// Update this whenever adding new providers so that the client can
export const providers = ['github'] as const;
export type OAuthProviders = (typeof providers)[number];

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session {
    user: {
      id: string;
      contactId?: number;
    } & DefaultSession['user'];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth({
  adapter: DrizzleAdapter(db, tableCreator),
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
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),

    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
