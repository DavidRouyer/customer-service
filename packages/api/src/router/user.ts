import { Direction } from '@cs/kyaku/types/query';

import UserService from '../services/user';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const userService: UserService = ctx.container.resolve('userService');
    return await userService.list(
      {},
      { relations: {}, direction: Direction.Forward }
    );
  }),
});
