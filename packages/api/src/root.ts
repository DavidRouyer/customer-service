import { authRouter } from './router/auth';
import { contactRouter } from './router/contact';
import { messageRouter } from './router/message';
import { ticketRouter } from './router/ticket';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  contact: contactRouter,
  message: messageRouter,
  ticket: ticketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
