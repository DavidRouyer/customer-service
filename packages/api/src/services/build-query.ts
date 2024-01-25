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

export const sortDirection = (sortBy: SortDirection) => {
  return sortBy === SortDirection.ASC ? asc : desc;
};
export const filterBySortDirection = (sortBy: SortDirection) => {
  return sortBy === SortDirection.ASC ? gt : lt;
};
