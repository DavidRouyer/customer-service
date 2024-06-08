import { GraphQLError } from 'graphql';

import type { Cursor } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types';

import { base64, unbase64 } from './base64';

export interface ConnectionArguments {
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
}

interface ArrayMetaInfo<T> {
  direction: Direction;
  getLastValue: (item: T) => string;
  limit: number;
}

export const parseCursor = (cursor: string) => {
  const cursorStringified = unbase64(cursor);
  try {
    const parsedCursor = JSON.parse(cursorStringified) as Cursor;
    if (
      typeof parsedCursor.lastId !== 'string' ||
      typeof parsedCursor.lastValue !== 'string'
    ) {
      throw new Error();
    }
    return parsedCursor;
  } catch {
    throw new GraphQLError('Invalid cursor');
  }
};

export function composeCursor(cursor: Cursor): string {
  return base64(JSON.stringify(cursor));
}

export const validatePaginationArguments = (
  { before, after, first, last }: ConnectionArguments,
  { min = 1, max = 100 }
) => {
  let cursor: Cursor | null = null; // default cursor
  let direction = Direction.Forward; // default direction
  let limit = 50; // default limit

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
    limit = first;
    direction = Direction.Forward;
  }
  if (typeof last === 'number') {
    if (last < min || last > max) {
      throw new GraphQLError(
        `"last" argument value is outside the valid range of '${min}' to '${max}'`
      );
    }
    limit = last;
    direction = Direction.Backward;
  }
  if (typeof before === 'string') {
    cursor = parseCursor(before);
    direction = Direction.Backward;
  }
  if (typeof after === 'string') {
    cursor = parseCursor(after);
    direction = Direction.Forward;
  }

  return { cursor, direction, limit };
};

export const connectionFromArray = <T extends { id: string }>({
  array,
  args: { before, after, first, last },
  meta: { direction, getLastValue, limit },
}: {
  array: readonly T[];
  args: ConnectionArguments;
  meta: ArrayMetaInfo<T>;
}) => {
  let slice = array.slice(0, limit);
  if (direction === Direction.Backward) {
    slice = slice.toReversed();
  }

  const edges = slice.map((value) => ({
    cursor: composeCursor({ lastId: value.id, lastValue: getLastValue(value) }),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const hasNextPage = array.length > limit;
  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage:
        typeof last === 'number' ? hasNextPage : typeof after === 'number',
      hasNextPage:
        typeof first === 'number' ? hasNextPage : typeof before === 'number',
    },
  };
};
