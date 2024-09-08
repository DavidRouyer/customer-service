import type { AuthConfig } from '@auth/core';
import { Auth } from '@auth/core';
import GitHub from '@auth/core/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { dbConnection, schema } from '@cs/database';

const authOptions: AuthConfig = {
  trustHost: process.env.AUTH_TRUST_HOST === 'true',
  secret: process.env.AUTH_SECRET,
  basePath: '/api/auth',
  adapter: {
    ...DrizzleAdapter(dbConnection, {
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
};

export { Auth, authOptions };
