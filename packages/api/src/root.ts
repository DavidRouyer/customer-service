import { authRouter } from './router/auth';
import { contactRouter } from './router/contact';
import { labelRouter } from './router/label';
import { labelTypeRouter } from './router/labelType';
import { ticketRouter } from './router/ticket';
import { ticketActivityRouter } from './router/ticketActivity';
import { ticketChatRouter } from './router/ticketChat';
import { ticketNoteRouter } from './router/ticketNote';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  contact: contactRouter,
  label: labelRouter,
  labelType: labelTypeRouter,
  ticket: ticketRouter,
  ticketActivity: ticketActivityRouter,
  ticketChat: ticketChatRouter,
  ticketNote: ticketNoteRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
