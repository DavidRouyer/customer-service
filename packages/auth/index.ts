import { randomUUID } from 'crypto';
import type { DefaultSession } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import isEmail from 'validator/lib/isEmail';

import { db, eq, schema, tableCreator } from '@cs/database';

export type { Session } from 'next-auth';

// Update this whenever adding new providers so that the client can
export const providers = ['email'] as const;
export type OAuthProviders = (typeof providers)[number];

declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

const maxAge = 30 * 24 * 60 * 60; // 30 days

const authorize = async (
  credentials: Partial<Record<'password' | 'email', unknown>>
) => {
  const { email, password } = credentials as {
    email: string;
    password: string;
  };
  let user:
    | {
        email: string;
        id: string;
        name: string | null;
        emailVerified: Date | null;
        password: string | null;
        image: string | null;
      }
    | undefined;

  try {
    if (!isEmail(email)) {
      throw new Error('Email should be a valid email address');
    }
    user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    if (!user) {
      const users = await db
        .insert(schema.users)
        .values({
          id: randomUUID(),
          email,
          password: await bcrypt.hash(password, 10),
        })
        .returning();
      user = users[0];
    } else {
      const passwordsMatch = await bcrypt.compare(password, user.password!);
      if (!passwordsMatch) {
        throw new Error('Password is not correct');
      }
    }
    const token = randomUUID();
    await db.insert(schema.sessions).values({
      userId: user!.id,
      expires: new Date(Date.now() + maxAge * 1000),
      sessionToken: token,
    });
    return {
      id: user!.id,
      email: user!.email,
      name: user!.name,
      image: user!.image,
      sessionToken: token,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth({
  adapter: DrizzleAdapter(db, tableCreator),
  providers: [
    CredentialsProvider({
      name: 'email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: maxAge, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    jwt({ token, user }) {
      if (typeof user !== typeof undefined) {
        token.user = user;
      }
      return token;
    },
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),

    // @TODO - if you wanna have auth on the edge
    // jwt: ({ token, profile }) => {
    //   if (profile?.id) {
    //     token.id = profile.id;
    //     token.image = profile.picture;
    //   }
    //   return token;
    // },

    // @TODO
    // authorized({ request, auth }) {
    //   return !!auth?.user
    // }
  },
});
