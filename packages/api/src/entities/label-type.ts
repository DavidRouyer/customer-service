import { db, InferSelectModel, schema } from '@cs/database';
import { SortDirection } from '@cs/kyaku/types/sort-direction';

export type LabelType = InferSelectModel<typeof schema.labelTypes>;
export type LabelTypeRelations = NonNullable<
  Parameters<(typeof db)['query']['labelTypes']['findFirst']>[0]
>['with'];

export type LabelTypeSort =
  | { createdAt: SortDirection }
  | { name: SortDirection };
