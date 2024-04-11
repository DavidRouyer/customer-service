import { Direction } from '@cs/kyaku/types/query';

import { CustomerSortField } from '../entities/customer';
import CustomerService from '../services/customer';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const customerRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const customerService: CustomerService =
      ctx.container.resolve('customerService');
    return await customerService.list({
      direction: Direction.Forward,
      limit: 50,
      sortBy: CustomerSortField.name,
      relations: {
        createdBy: true,
        updatedBy: true,
      },
    });
  }),
});
