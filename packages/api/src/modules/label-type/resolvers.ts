import { createModule } from 'graphql-modules';

import { SortDirection } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types/query';

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

const paginate = <T>({
  array,
  args: { before, after, first, last },
}: {
  array: ReadonlyArray<T>;
  args: ConnectionArguments;
}) => {
  let startOffset = 0;
  let endOffset = array.length;

  if (typeof first === 'number' && typeof last === 'number') {
    throw new Error(
      'Passing both "first" and "last" to paginate is not supported'
    );
  }

  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }

    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (typeof last === 'number') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }

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
      let limit = 50;
      if (typeof first === 'number' && typeof last === 'number') {
        throw new Error(
          'Passing both "first" and "last" to paginate is not supported'
        );
      }
      if (typeof first === 'number') {
        if (first < 0) {
          throw new Error('Argument "first" must be a non-negative integer');
        }
        limit = first + 1;
      }
      if (typeof last === 'number') {
        if (last < 0) {
          throw new Error('Argument "last" must be a non-negative integer');
        }
        limit = last + 1;
      }

      const labelTypeService: LabelTypeService =
        ctx.container.resolve('labelTypeService');

      const labelTypes = await labelTypeService.list(
        {
          isArchived: false,
        },
        {
          direction: Direction.Forward,
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
