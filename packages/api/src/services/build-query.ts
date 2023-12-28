import {
  asc,
  Column,
  desc,
  GetColumnData,
  gt,
  gte,
  inArray,
  lt,
  lte,
  notInArray,
} from '@cs/database';
import { SortDirection } from '@cs/kyaku/types/sort-direction';

export type InclusionFilterOperator<T> = { in: T[] } | { notIn: T[] };

export type QuantityFilterOperator<T> =
  | { lt: T }
  | { gt: T }
  | { lte: T }
  | { gte: T };

export const quantityFilterOperator = <TCol extends Column>(
  column: TCol,
  operator: QuantityFilterOperator<GetColumnData<TCol, 'raw'>>
) => {
  return 'lt' in operator
    ? lt(column, operator.lt)
    : 'gt' in operator
      ? gt(column, operator.gt)
      : 'lte' in operator
        ? lte(column, operator.lte)
        : 'gte' in operator
          ? gte(column, operator.gte)
          : undefined;
};

export const inclusionFilterOperator = <TCol extends Column>(
  column: TCol,
  operator: InclusionFilterOperator<GetColumnData<TCol, 'raw'>>
) => {
  return 'in' in operator
    ? inArray(column, operator.in)
    : 'notIn' in operator
      ? notInArray(column, operator.notIn)
      : undefined;
};

export const sortDirection = (sortBy: SortDirection) => {
  return sortBy === SortDirection.ASC ? asc : desc;
};
