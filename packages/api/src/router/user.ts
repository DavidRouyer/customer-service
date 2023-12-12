import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
  }),
});
