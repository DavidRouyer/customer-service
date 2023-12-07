import { asc, isNotNull, schema } from '@cs/database';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const customerRouter = createTRPCRouter({
  allWithUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.customers.findMany({
      where: isNotNull(schema.customers.userId),
      orderBy: asc(schema.customers.name),
    });
  }),
});
