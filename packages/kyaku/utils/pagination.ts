import { GraphQLError } from 'graphql';

import { Cursor, Direction } from '@cs/kyaku/types/query';

import { base64, unbase64 } from './base64';

export interface ConnectionArguments {
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
}

export const parseCursor = (cursor: string) => {
  const cursorStringified = unbase64(cursor);
  try {
    const parsedCursor: Cursor = JSON.parse(cursorStringified);
    if (
      typeof parsedCursor.lastId !== 'string' ||
      typeof parsedCursor.lastValue !== 'string'
    ) {
      throw new Error();
    }
    return parsedCursor;
  } catch (e) {
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

export const paginate = <T extends { id: string }>({
  array,
  hasNextPage,
  getLastValue,
  args: { before, after, first, last },
}: {
  array: ReadonlyArray<T>;
  hasNextPage: boolean;
  getLastValue: (item: T) => string;
  args: ConnectionArguments;
}) => {
  const edges = array.map((item) => ({
    cursor: composeCursor({ lastId: item.id, lastValue: getLastValue(item) }),
    node: item,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
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
