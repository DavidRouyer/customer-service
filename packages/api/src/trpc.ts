/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from '@trpc/server';
import { asClass, asValue, createContainer } from 'awilix';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { auth } from '@cs/auth';
import type { Session } from '@cs/auth';
import { drizzleConnection } from '@cs/database';

import CustomerRepository from './repositories/customer';
import LabelRepository from './repositories/label';
import LabelTypeRepository from './repositories/label-type';
import TicketRepository from './repositories/ticket';
import TicketMentionRepository from './repositories/ticket-mention';
import TicketTimelineRepository from './repositories/ticket-timeline';
import UserRepository from './repositories/user';
import CustomerService from './services/customer';
import LabelService from './services/label';
import LabelTypeService from './services/label-type';
import TicketService from './services/ticket';
import TicketTimelineService from './services/ticket-timeline';
import UserService from './services/user';
import { UnitOfWork } from './unit-of-work';

const container = createContainer();
container.register({
  drizzleConnection: asValue(drizzleConnection),
  unitOfWork: asClass(UnitOfWork).scoped(),
  customerRepository: asClass(CustomerRepository).scoped(),
  labelRepository: asClass(LabelRepository).scoped(),
  labelTypeRepository: asClass(LabelTypeRepository).scoped(),
  ticketRepository: asClass(TicketRepository).scoped(),
  ticketMentionRepository: asClass(TicketMentionRepository).scoped(),
  ticketTimelineRepository: asClass(TicketTimelineRepository).scoped(),
  userRepository: asClass(UserRepository).scoped(),
  customerService: asClass(CustomerService).scoped(),
  labelTypeService: asClass(LabelTypeService).scoped(),
  labelService: asClass(LabelService).scoped(),
  ticketService: asClass(TicketService).scoped(),
  ticketTimelineService: asClass(TicketTimelineService).scoped(),
  userService: asClass(UserService).scoped(),
});

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
  headers: Headers;
  session: Session | null;
}) => {
  const session = opts.session ?? (await auth());
  const source = opts.headers.get('x-trpc-source') ?? 'unknown';

  console.log('>>> tRPC Request from', source, 'by', session?.user);

  return {
    session,
    container,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});
