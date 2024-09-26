import {
  connectionFromArray,
  validatePaginationArguments,
} from '@kyaku/kyaku/utils';

import { authorize } from '../../authorize';
import type { Resolvers } from '../../generated-types/graphql';
import { UserSortField } from '../../services/user';
import type { UserService } from '../../services/user';
import typeDefs from './typeDefs';

const resolvers: Resolvers = {
  Query: {
    myUserInfo: async (_, __, { dataloaders, user }) => {
      const authorizedUser = authorize(user);

      try {
        return await dataloaders.userLoader.load(authorizedUser.id);
      } catch {
        return null;
      }
    },
    user: async (_, { userId }, { dataloaders }) => {
      try {
        return await dataloaders.userLoader.load(userId);
      } catch {
        return null;
      }
    },
    users: async (_, { before, after, first, last }, { container }) => {
      const { cursor, direction, limit } = validatePaginationArguments(
        { before, after, first, last },
        { min: 1, max: 100 }
      );

      const userService: UserService = container.resolve('userService');

      const users = await userService.list(
        {},
        {
          cursor: cursor ?? undefined,
          direction: direction,
          limit: limit + 1,
          sortBy: UserSortField.name,
        }
      );

      return connectionFromArray({
        array: users,
        args: { before, after, first, last },
        meta: {
          direction,
          getLastValue: (item) => item.name ?? '',
          limit,
        },
      });
    },
  },
};

export const userModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
