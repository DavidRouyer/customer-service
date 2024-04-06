import { createModule } from 'graphql-modules';

import { Direction } from '@cs/kyaku/types/query';

import UserService from '../../services/user';
import { UserModule } from './generated-types/module-types';
import typeDefs from './typedefs/user.graphql';

const resolvers: UserModule.Resolvers = {
  Query: {
    users: async (_, __, ctx: GraphQLModules.ModuleContext) => {
      const userService: UserService = ctx.container.resolve('userService');

      const users = await userService.list(
        {},
        { relations: {}, limit: 50, direction: Direction.Forward }
      );

      return users;
    },
  },
};

export const userModule = createModule({
  id: 'user-module',
  dirname: __dirname,
  typeDefs: [typeDefs],
  resolvers: [resolvers],
});
