import {
  asc,
  Column,
  desc,
  GetColumnData,
  gt,
  inArray,
  lt,
  notInArray,
} from '@cs/database';
import { SortDirection } from '@cs/kyaku/types';

export type InclusionFilterOperator<T> =
  | { eq: string | null }
  | { ne: string | null }
  | { in: T[] }
  | { notIn: T[] };

export const inclusionFilterOperator = <TCol extends Column>(
  column: TCol,
  operator: InclusionFilterOperator<GetColumnData<TCol, 'raw'>>
) => {
  if ('in' in operator) return inArray(column, operator.in);
  if ('notIn' in operator) return notInArray(column, operator.notIn);
  return undefined;
};

export const sortDirection = (sortBy: SortDirection) => {
  return sortBy === SortDirection.ASC ? asc : desc;
};
export const filterBySortDirection = (sortBy: SortDirection) => {
  return sortBy === SortDirection.ASC ? gt : lt;
};
