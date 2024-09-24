import type { InferSelectModel, schema } from '@cs/database';

import type { InclusionFilterOperator } from '../../../database/build-query';

type UserSelectModel = InferSelectModel<typeof schema.users>;

export interface UserFilters {
  userIds?: InclusionFilterOperator<UserSelectModel['id']>;
}

export enum UserSortField {
  name = 'name',
}
