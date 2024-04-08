import { GraphQLError } from 'graphql';
import { createModule } from 'graphql-modules';

import { SortDirection } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types/query';

import { InputMaybe } from '../../generated-types/graphql';
import LabelTypeService from '../../services/label-type';
import { base64 } from './base64';
import { LabelTypeModule } from './generated-types/module-types';
import typeDefs from './typedefs/label-type.graphql';

export interface ConnectionArguments {
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
}

const validatePaginationArguments = (
  { before, after, first, last }: ConnectionArguments,
  { min = 1, max = 100 }
) => {
  if (typeof first === 'number' && typeof last === 'number') {
    throw new GraphQLError(
      'Passing both "first" and "last" to paginate is not supported'
    );
  }
  if (typeof first === 'number' && typeof before === 'string') {
    throw new GraphQLError(
      'Passing both "first" and "before" to paginate is not supported'
    );
  }
  if (typeof last === 'number' && typeof after === 'string') {
    throw new GraphQLError(
      'Passing both "last" and "after" to paginate is not supported'
    );
  }
  if (typeof first === 'number') {
    if (first < min || first > max) {
      throw new GraphQLError(
        `"first" argument value is outside the valid range of '${min}' to '${max}'`
      );
    }
  }
  if (typeof last === 'number') {
    if (last < min || last > max) {
      throw new GraphQLError(
        `"last" argument value is outside the valid range of '${min}' to '${max}'`
      );
    }
  }
};

const getPaginationLimit = (
  first: InputMaybe<number> | undefined,
  last: InputMaybe<number> | undefined
) => {
  let limit = 50; // default limit
  if (typeof first === 'number') {
    limit = first;
  }
  if (typeof last === 'number') {
    limit = last;
  }
  return limit + 1;
};

const paginate = <T>({
  array,
  args: { before, after, first, last },
}: {
  array: ReadonlyArray<T>;
  args: ConnectionArguments;
}) => {
  let startOffset = 0;
  let endOffset = array.length;

  if (typeof first === 'number') {
    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (typeof last === 'number') {
    startOffset++;
    endOffset = Math.min(endOffset, startOffset + last);
  }

  const slice = array.slice(startOffset, endOffset);

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(index),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: typeof last === 'number' ? array.length > last : false,
      hasNextPage: typeof first === 'number' ? array.length > first : false,
    },
  };
};

const PREFIX = 'arrayconnection:';

export function offsetToCursor(offset: number): string {
  return base64(PREFIX + offset.toString());
}

const resolvers: LabelTypeModule.Resolvers = {
  Query: {
    labelTypes: async (
      _,
      { before, after, first, last },
      ctx: GraphQLModules.ModuleContext
    ) => {
      validatePaginationArguments(
        { before, after, first, last },
        { min: 1, max: 100 }
      );
      let limit = getPaginationLimit(first, last);

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      const labelTypes = await labelTypeService.list(
        {
          isArchived: false,
        },
        {
          direction:
            typeof first === 'number' ? Direction.Forward : Direction.Backward,
          relations: {
            createdBy: true,
            updatedBy: true,
          },
          limit: limit,
          sortBy: {
            name: SortDirection.ASC,
          },
        }
      );

      return paginate({
        array: labelTypes,
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
