import type { InferInsertModel, InferSelectModel, KnownKeysOnly } from '..';
import { eq, schema } from '..';
import type { IncludeRelation } from '../build-query';
import type { DbTransactionScope } from '../db-transaction';
import { BaseRepository } from './base-repository';

export default class CustomerRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'customers'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'customers'>, 'limit'>>
  ) {
    return this.dbConnection.query.customers.findFirst(config);
  }

  findMany<T extends IncludeRelation<'customers'>>(
    config: KnownKeysOnly<T, IncludeRelation<'customers'>>
  ) {
    return this.dbConnection.query.customers.findMany(config);
  }

  create(
    entity: InferInsertModel<typeof schema.customers>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .insert(schema.customers)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<InferInsertModel<typeof schema.customers>> &
      NonNullable<Pick<InferSelectModel<typeof schema.customers>, 'id'>>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .update(schema.customers)
      .set(entity)
      .where(eq(schema.customers.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
