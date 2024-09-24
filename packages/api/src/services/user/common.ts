import type {
  InclusionFilterOperator,
  InferSelectModel,
  schema,
} from '@cs/database';

type UserSelectModel = InferSelectModel<typeof schema.users>;

export interface UserFilters {
  userIds?: InclusionFilterOperator<UserSelectModel['id']>;
}

export enum UserSortField {
  name = 'name',
}
