import { z } from 'zod';

import { SortDirection } from '../entities/ticket';
import LabelTypeService from '../services/label-type';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const labelTypeRouter = createTRPCRouter({
  all: protectedProcedure
    .input(z.object({ isArchived: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');
      return await labelTypeService.list(input, {
        relations: {},
        sortBy: {
          name: SortDirection.ASC,
        },
      });
    }),

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
      return await labelTypeService.create({
        ...input,
        createdById: ctx.session.user.id,
      });
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
