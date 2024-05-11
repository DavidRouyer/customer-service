import { authRouter } from './router/auth';
import { ticketRouter } from './router/ticket';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  ticket: ticketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
