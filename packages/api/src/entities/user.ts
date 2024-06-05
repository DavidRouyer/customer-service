import type { InferInsertModel, InferSelectModel, schema } from '@cs/database';

import type { InclusionFilterOperator } from '../services/build-query';

export type User = Omit<InferSelectModel<typeof schema.users>, 'password'>;

export type UserInsert = Omit<
  InferInsertModel<typeof schema.users>,
  'password'
>;

export const USER_COLUMNS = {
  id: true,
  email: true,
  emailVerified: true,
  name: true,
  image: true,
} as const;

export interface UserFilters {
  userIds?: InclusionFilterOperator<User['id']>;
}

export enum UserSortField {
  name = 'name',
}
