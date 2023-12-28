import { db, InferSelectModel, schema } from '@cs/database';
import { SortDirection } from '@cs/kyaku/types';

export type User = InferSelectModel<typeof schema.users>;
export type UserRelations = NonNullable<
  Parameters<(typeof db)['query']['users']['findFirst']>[0]
>['with'];

export type UserSort = { createdAt: SortDirection } | { name: SortDirection };
