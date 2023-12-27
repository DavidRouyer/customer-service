import { z } from 'zod';

import LabelService from '../services/label';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const labelRouter = createTRPCRouter({
  addLabels: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        labelTypeIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const labelService: LabelService = ctx.container.resolve('labelService');
      return await labelService.addLabels(
        input.ticketId,
        input.labelTypeIds,
        ctx.session.user.id
      );
    }),

  removeLabels: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        labelIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const labelService: LabelService = ctx.container.resolve('labelService');
      return await labelService.removeLabels(
        input.ticketId,
        input.labelIds,
        ctx.session.user.id
      );
    }),
});
