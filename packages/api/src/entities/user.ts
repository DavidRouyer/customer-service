import { InferInsertModel, InferSelectModel, schema } from '@cs/database';

import { InclusionFilterOperator } from '../services/build-query';

export type User = Omit<InferSelectModel<typeof schema.users>, 'password'>;

export type UserInsert = Omit<
  InferInsertModel<typeof schema.users>,
  'password'
>;

export type UserWith<T> = {};

export const USER_COLUMNS = {
  id: true,
  email: true,
  emailVerified: true,
  name: true,
  image: true,
} as const;

export type UserFilters = {
  id?: InclusionFilterOperator<User['id']>;
};

export enum UserSortField {
  name = 'name',
}
