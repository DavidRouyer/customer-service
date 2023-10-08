import { authRouter } from './router/auth';
import { contactRouter } from './router/contact';
import { messageRouter } from './router/message';
import { ticketRouter } from './router/ticket';
import { ticketActivityRouter } from './router/ticketActivity';
import { ticketCommentRouter } from './router/ticketComment';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  contact: contactRouter,
  message: messageRouter,
  ticket: ticketRouter,
  ticketActivity: ticketActivityRouter,
  ticketComment: ticketCommentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
