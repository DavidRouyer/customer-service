import { authRouter } from './router/auth';
import { contactRouter } from './router/contact';
import { labelRouter } from './router/label';
import { labelTypeRouter } from './router/labelType';
import { messageRouter } from './router/message';
import { ticketRouter } from './router/ticket';
import { ticketActivityRouter } from './router/ticketActivity';
import { ticketNoteRouter } from './router/ticketNote';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  contact: contactRouter,
  label: labelRouter,
  labelType: labelTypeRouter,
  message: messageRouter,
  ticket: ticketRouter,
  ticketActivity: ticketActivityRouter,
  ticketNote: ticketNoteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
