import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { asc, eq, isNotNull, isNull, schema } from '@cs/database';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const labelTypeRouter = createTRPCRouter({
  all: protectedProcedure
    .input(z.object({ isArchived: z.boolean() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.labelTypes.findMany({
        orderBy: asc(schema.labelTypes.name),
        where: input.isArchived
          ? isNotNull(schema.labelTypes.archivedAt)
          : isNull(schema.labelTypes.archivedAt),
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
      const labelType = await ctx.db.query.labelTypes.findFirst({
        where: eq(schema.labelTypes.name, input.name),
      });

      if (!labelType)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'label_type_name_already_exists',
        });

      return ctx.db
        .insert(schema.labelTypes)
        .values({
          ...input,
          createdById: ctx.session.user.contactId ?? 0,
        })
        .returning({ id: schema.labelTypes.id });
    }),

  archive: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const labelType = await ctx.db.query.labelTypes.findFirst({
        where: eq(schema.labelTypes.id, input.id),
      });

      if (!labelType)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'label_type_name_not_exists',
        });

      if (labelType.archivedAt)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'label_type_name_already_archived',
        });

      const archiveDate = new Date();

      return ctx.db
        .insert(schema.labelTypes)
        .values({
          ...labelType,
          updatedAt: archiveDate,
          archivedAt: archiveDate,
        })
        .returning({ id: schema.labelTypes.id });
    }),

  unarchive: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const labelType = await ctx.db.query.labelTypes.findFirst({
        where: eq(schema.labelTypes.id, input.id),
      });

      if (!labelType)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'label_type_name_not_exists',
        });

      if (!labelType.archivedAt)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'label_type_name_already_unarchived',
        });

      const unarchiveDate = new Date();

      return ctx.db
        .insert(schema.labelTypes)
        .values({
          ...labelType,
          updatedAt: unarchiveDate,
          archivedAt: null,
        })
        .returning({ id: schema.labelTypes.id });
    }),
});
