import { createModule } from 'graphql-modules';

import {
  paginate,
  validatePaginationArguments,
} from '@cs/kyaku/utils/pagination';

import { LabelTypeSortField } from '../../entities/label-type';
import LabelTypeService from '../../services/label-type';
import { LabelTypeModule } from './generated-types/module-types';
import typeDefs from './typedefs/label-type.graphql';

const resolvers: LabelTypeModule.Resolvers = {
  Query: {
    labelTypes: async (
      _,
      { filters, before, after, first, last },
      ctx: GraphQLModules.ModuleContext
    ) => {
      const { cursor, direction, limit } = validatePaginationArguments(
        { before, after, first, last },
        { min: 1, max: 100 }
      );

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      const labelTypeResult = await labelTypeService.list(
        {
          isArchived: filters?.isArchived ?? false,
        },
        {
          cursor: cursor ?? undefined,
          direction: direction,
          limit: limit,
          relations: {
            createdBy: true,
            updatedBy: true,
          },
          sortBy: LabelTypeSortField.name,
        }
      );

      return paginate({
        array: labelTypeResult.items,
        hasNextPage: labelTypeResult.hasNextPage,
        getLastValue: (item) => item.name,
        args: { before, after, first, last },
      });
    },
  },
};

export const labelTypeModule = createModule({
  id: 'labelType-module',
  dirname: __dirname,
  typeDefs: [typeDefs],
  resolvers: [resolvers],
});
