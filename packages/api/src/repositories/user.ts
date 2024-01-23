import { eq, inArray, KnownKeysOnly, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { User, UserInsert } from '../entities/user';
import { IncludeRelation } from '../services/build-query';
import { BaseRepository } from './base-repository';

export default class UserRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'users'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'users'>, 'limit'>>
  ) {
    return this.drizzleConnection.query.users.findFirst(config);
  }

  findMany<T extends KnownKeysOnly<T, IncludeRelation<'users'>>>(config: T) {
    return this.drizzleConnection.query.users.findMany(config);
  }

  create(entity: UserInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope
      .insert(schema.users)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<UserInsert> & NonNullable<Pick<User, 'id'>>,
    transactionScope: DrizzleTransactionScope
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
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.users)
      .set(entity)
      .where(inArray(schema.users.id, entityIds));
  }
}
