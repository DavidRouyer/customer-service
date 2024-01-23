import { InferInsertModel, InferSelectModel, schema } from '@cs/database';
import { SortDirection } from '@cs/kyaku/types';

export type User = Omit<InferSelectModel<typeof schema.users>, 'password'>;

export type UserInsert = Omit<
  InferInsertModel<typeof schema.users>,
  'password'
>;

export type UserWith<T> = {};

export type UserSort = { createdAt: SortDirection } | { name: SortDirection };
