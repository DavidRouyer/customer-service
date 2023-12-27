import { db, InferSelectModel, schema } from '@cs/database';

import { SortDirection } from './ticket';

export type User = InferSelectModel<typeof schema.users>;
export type UserRelations = NonNullable<
  Parameters<(typeof db)['query']['users']['findFirst']>[0]
>['with'];

export type UserSort = { createdAt: SortDirection } | { name: SortDirection };
