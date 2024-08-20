import type { AuthConfig } from '@auth/core';
import { Auth } from '@auth/core';
import GitHub from '@auth/core/providers/github';
import type { Session } from '@auth/core/types';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import getURL from 'requrl';
import type { H3Event } from 'vinxi/http';
import {
  getRequestHost,
  getRequestProtocol,
  getRequestWebStream,
} from 'vinxi/http';

import { dbConnection, schema } from '@cs/database';

/**
 * Get the request url or construct it.
 * Adapted from `h3` to also account for server origin.
 *
 * ## WARNING
 * Please ensure that any URL produced by this function has a trusted host!
 *
 * @param trustHost Whether the host can be trusted. If `true`, base will be inferred from the request, otherwise the configured origin will be used.
 * @throws {Error} When server origin was incorrectly configured or when URL building failed
 */
function getRequestURLFromH3Event(event: H3Event, trustHost: boolean): URL {
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    '/'
  );
  const base = getRequestBaseFromH3Event(event, trustHost);
  return new URL(path, base);
}

/**
 * Gets the request base in the form of origin.
 *
 * ## WARNING
 * Please ensure that any URL produced by this function has a trusted host!
 *
 * @param trustHost Whether the host can be trusted. If `true`, base will be inferred from the request, otherwise the configured origin will be used.
 * @throws {Error} When server origin was incorrectly configured
 */
function getRequestBaseFromH3Event(event: H3Event, trustHost: boolean): string {
  if (trustHost) {
    const host = getRequestHost(event, { xForwardedHost: trustHost });
    const protocol = getRequestProtocol(event);

    return `${protocol}://${host}`;
  } else {
    // This may throw, we don't catch it
    // TODO: This should be added
    //const origin = getServerOrigin(event);
    const origin = getURL(event.node.req, false);

    return origin;
  }
}

/**
 * Generate an Auth.js request object that can be passed into the handler.
 * This method should only be used for authentication endpoints.
 *
 * @param event H3Event to transform into `Request`
 */
export function createRequestForAuthjs(
  event: H3Event,
  trustHostUserPreference: boolean
): Request {
  // Adapted from `h3`
  const webRequest =
    event.web?.request ||
    new Request(getRequestURLFromH3Event(event, trustHostUserPreference), {
      // @ts-ignore Undici option
      duplex: 'half',
      method: event.method,
      headers: event.headers,
      body: getRequestWebStream(event),
    });

  return webRequest;
}

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

export async function getSession(request: Request): Promise<Session | null> {
  const url = new URL('/api/auth/session', request.url);

  const response = await Auth(
    new Request(url, { headers: request.headers }),
    authOptions
  );

  const { status = 200 } = response;

  const data = await response.json();
  console.log('data', data, status);

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}

const authHandler = (request: Request) => {
  return Auth(request, authOptions);
};

export default authHandler;
