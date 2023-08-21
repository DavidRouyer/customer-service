import { authRouter } from './router/auth';
import { messageRouter } from './router/message';
import { ticketRouter } from './router/ticket';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  message: messageRouter,
  ticket: ticketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
