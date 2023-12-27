import { db, InferSelectModel, schema } from '@cs/database';

import { SortDirection } from './ticket';

export type Customer = InferSelectModel<typeof schema.customers>;
export type CustomerRelations = NonNullable<
  Parameters<(typeof db)['query']['customers']['findFirst']>[0]
>['with'];

export type CustomerSort =
  | { createdAt: SortDirection }
  | { name: SortDirection };
