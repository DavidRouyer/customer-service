import { Direction } from '@cs/kyaku/types/query';

import { Resolvers } from '../../generated-types/graphql';
import UserService from '../../services/user';
import typeDefs from './typeDefs.graphql';

const resolvers: Resolvers = {
  Query: {
    users: async (_, __, ctx) => {
      const userService: UserService = ctx.container.resolve('userService');

      const users = await userService.list(
        {},
        { relations: {}, limit: 50, direction: Direction.Forward }
      );

      return users;
    },
  },
};

export const userModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
