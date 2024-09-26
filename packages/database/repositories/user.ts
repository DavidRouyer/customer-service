import type {
  InferInsertModel,
  InferSelectModel,
  KnownKeysOnly,
} from '@kyaku/database';
import { eq, schema } from '@kyaku/database';

import type { IncludeRelation } from '../build-query';
import type { DbTransactionScope } from '../db-transaction';
import { BaseRepository } from './base-repository';

export default class UserRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'users'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'users'>, 'limit'>>
  ) {
    return this.dbConnection.query.users.findFirst(config);
  }

  findMany<T extends IncludeRelation<'users'>>(
    config: KnownKeysOnly<T, IncludeRelation<'users'>>
  ) {
    return this.dbConnection.query.users.findMany(config);
  }

  create(
    entity: InferInsertModel<typeof schema.users>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .insert(schema.users)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<InferInsertModel<typeof schema.users>> &
      NonNullable<Pick<InferSelectModel<typeof schema.users>, 'id'>>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .update(schema.users)
      .set(entity)
      .where(eq(schema.users.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
