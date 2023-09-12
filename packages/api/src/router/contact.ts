import { asc, isNotNull, schema } from '@cs/database';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const contactRouter = createTRPCRouter({
  allWithUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.contacts.findMany({
      where: isNotNull(schema.contacts.userId),
      orderBy: asc(schema.contacts.name),
    });
  }),
});
