import { authRouter } from './router/auth';
import { customerRouter } from './router/customer';
import { labelRouter } from './router/label';
import { labelTypeRouter } from './router/labelType';
import { ticketRouter } from './router/ticket';
import { ticketActivityRouter } from './router/ticketActivity';
import { ticketChatRouter } from './router/ticketChat';
import { ticketNoteRouter } from './router/ticketNote';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  customer: customerRouter,
  label: labelRouter,
  labelType: labelTypeRouter,
  ticket: ticketRouter,
  ticketActivity: ticketActivityRouter,
  ticketChat: ticketChatRouter,
  ticketNote: ticketNoteRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
