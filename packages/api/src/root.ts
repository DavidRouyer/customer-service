import { authRouter } from './router/auth';
import { labelRouter } from './router/label';
import { labelTypeRouter } from './router/label-type';
import { ticketRouter } from './router/ticket';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  label: labelRouter,
  labelType: labelTypeRouter,
  ticket: ticketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
