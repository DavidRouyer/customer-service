import { SortDirection } from '@cs/kyaku/types/sort-direction';

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
      sortBy: {
        name: SortDirection.ASC,
      },
    });
  }),
});
