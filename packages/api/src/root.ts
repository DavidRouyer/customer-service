import { authRouter } from './router/auth';
import { customerRouter } from './router/customer';
import { labelRouter } from './router/label';
import { labelTypeRouter } from './router/label-type';
import { ticketRouter } from './router/ticket';
import { ticketTimelineRouter } from './router/ticket-timeline';
import { userRouter } from './router/user';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  customer: customerRouter,
  label: labelRouter,
  labelType: labelTypeRouter,
  ticket: ticketRouter,
  ticketTimeline: ticketTimelineRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
