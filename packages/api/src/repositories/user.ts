import { eq, inArray, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { User, UserInsert } from '../entities/user';
import { BaseRepository } from './base-repository';

export default class UserRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<
    T extends Parameters<
      (typeof this.dataSource)['query']['users']['findFirst']
    >,
  >(...[config]: T) {
    return this.dataSource.query.users.findFirst(config);
  }

  findMany<
    T extends Parameters<
      (typeof this.dataSource)['query']['users']['findMany']
    >,
  >(...[config]: T) {
    return this.dataSource.query.users.findMany(config);
  }

  create(
    entity: UserInsert | UserInsert[],
    transactionScope: DrizzleTransactionScope
  ) {
    if (Array.isArray(entity)) {
      return transactionScope.insert(schema.users).values(entity);
    }
    return transactionScope.insert(schema.users).values(entity);
  }

  update(
    entity: Partial<UserInsert> & NonNullable<Pick<User, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.users)
      .set(entity)
      .where(eq(schema.users.id, entity.id));
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
