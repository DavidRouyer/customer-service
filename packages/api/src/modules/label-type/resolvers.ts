import {
  paginate,
  validatePaginationArguments,
} from '@cs/kyaku/utils/pagination';

import { LabelTypeSortField } from '../../entities/label-type';
import { Resolvers } from '../../generated-types/graphql';
import LabelTypeService from '../../services/label-type';
import typeDefs from './typedefs/label-type.graphql';

const resolvers: Resolvers = {
  Query: {
    labelTypes: async (_, { filters, before, after, first, last }, ctx) => {
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

export const labelTypeModule = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
