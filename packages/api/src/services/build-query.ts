import {
  asc,
  BuildQueryResult,
  Column,
  DBQueryConfig,
  desc,
  ExtractTablesWithRelations,
  GetColumnData,
  gt,
  inArray,
  lt,
  notInArray,
  schema,
} from '@cs/database';
import { SortDirection } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types/query';

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'many',
  true,
  TSchema,
  TSchema[TableName]
>;
export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

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

export const sortByDirection = (direction: Direction) => {
  return direction === Direction.Forward ? asc : desc;
};

export const sortBySortDirection = (
  sortBy: SortDirection,
  direction: Direction
) => {
  return (sortBy === SortDirection.ASC && direction === Direction.Forward) ||
    (sortBy === SortDirection.DESC && direction === Direction.Backward)
    ? asc
    : desc;
};

export const filterByDirection = (direction: Direction) => {
  return direction === Direction.Forward ? gt : lt;
};

export const filterBySortDirection = (
  sortBy: SortDirection,
  direction: Direction
) => {
  return (sortBy === SortDirection.ASC && direction === Direction.Forward) ||
    (sortBy === SortDirection.DESC && direction === Direction.Backward)
    ? gt
    : lt;
};
