import { z } from 'zod';

import { Direction } from '@cs/kyaku/types/query';

import { TicketTimelineSortField } from '../entities/ticket-timeline';
import TicketTimelineService from '../services/ticket-timeline';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketTimelineRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticketTimelineService: TicketTimelineService =
        ctx.container.resolve('ticketTimelineService');

      return await ticketTimelineService.list(
        { ticketId: input.ticketId },
        {
          relations: {
            customer: true,
            customerCreatedBy: true,
            userCreatedBy: true,
          },
          limit: 50,
          sortBy: TicketTimelineSortField.createdAt,
          direction: Direction.Forward,
        }
      );
    }),
});
