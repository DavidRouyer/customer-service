import { db, InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';
import { GetConfig } from '@cs/kyaku/types/query';

export type User = InferSelectModel<typeof schema.users>;
export type DbUserRelations = NonNullable<
  Parameters<(typeof db)['query']['users']['findFirst']>[0]
>['with'];
export type GetUserConfig = GetConfig<UserRelations>;
export type UserRelations = {};
export type FindUserConfig = FindConfig<UserRelations, UserSort>;

export type UserSort = { createdAt: SortDirection } | { name: SortDirection };
