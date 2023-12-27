import { z } from 'zod';

import { SortDirection } from '../entities/ticket';
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
            customerCreatedBy: true,
            userCreatedBy: {
              columns: {
                id: true,
                email: true,
                name: true,
                image: true,
              },
            },
          },
          sortBy: {
            createdAt: SortDirection.ASC,
          },
        }
      );
    }),
});
