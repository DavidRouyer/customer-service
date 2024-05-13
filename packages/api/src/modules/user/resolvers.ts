import {
  connectionFromArray,
  validatePaginationArguments,
} from '@cs/kyaku/utils/pagination';

import { authorize } from '../../authorize';
import { UserSortField } from '../../entities/user';
import { Resolvers } from '../../generated-types/graphql';
import UserService from '../../services/user';
import typeDefs from './typeDefs.graphql';

const resolvers: Resolvers = {
  Query: {
    myUserInfo: async (_, __, { dataloaders, user }) => {
      const authorizedUser = authorize(user);

      try {
        return await dataloaders.userLoader.load(authorizedUser.id);
      } catch (error) {
        return null;
      }
    },
    user: async (_, { id }, { dataloaders }) => {
      try {
        return await dataloaders.userLoader.load(id);
      } catch (error) {
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
