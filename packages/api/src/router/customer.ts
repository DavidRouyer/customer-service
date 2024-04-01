import { SortDirection } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types/query';

import CustomerService from '../services/customer';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const customerRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const customerService: CustomerService =
      ctx.container.resolve('customerService');
    return await customerService.list({
      relations: {
        createdBy: true,
        updatedBy: true,
      },
      limit: 50,
      sortBy: {
        name: SortDirection.ASC,
      },
      direction: Direction.Forward,
    });
  }),
});
