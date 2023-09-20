import { and, asc, isNotNull, ne, schema } from '@cs/database';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const contactRouter = createTRPCRouter({
  allWithUserId: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.contacts.findMany({
      where: and(
        isNotNull(schema.contacts.userId),
        ne(schema.contacts.id, ctx.session.user.contactId ?? 0)
      ),
      orderBy: asc(schema.contacts.name),
    });
  }),
});
