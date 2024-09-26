import type {
  InclusionFilterOperator,
  InferSelectModel,
  schema,
} from '@kyaku/database';

type UserSelectModel = InferSelectModel<typeof schema.users>;

export interface UserFilters {
  userIds?: InclusionFilterOperator<UserSelectModel['id']>;
}

export enum UserSortField {
  name = 'name',
}
