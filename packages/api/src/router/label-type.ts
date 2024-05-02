import { z } from 'zod';

import LabelTypeService from '../services/label-type';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const labelTypeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        icon: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');
      return await labelTypeService.create(
        {
          ...input,
        },
        ctx.session.user.id
      );
    }),

  archive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');
      return await labelTypeService.archive(input.id, ctx.session.user.id);
    }),

  unarchive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');
      return await labelTypeService.unarchive(input.id, ctx.session.user.id);
    }),
});
