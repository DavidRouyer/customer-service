import type { KnownKeysOnly } from '@cs/database';
import { eq, inArray, schema } from '@cs/database';

import type { DbTransactionScope } from '../db-transaction';
import type { User, UserInsert } from '../entities/user';
import type { IncludeRelation } from '../services/build-query';
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

  create(entity: UserInsert, transactionScope: DbTransactionScope) {
    return transactionScope
      .insert(schema.users)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<UserInsert> & NonNullable<Pick<User, 'id'>>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .update(schema.users)
      .set(entity)
      .where(eq(schema.users.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }

  updateMany(
    entityIds: User['id'][],
    entity: Omit<Partial<UserInsert>, 'id'>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .update(schema.users)
      .set(entity)
      .where(inArray(schema.users.id, entityIds));
  }
}
