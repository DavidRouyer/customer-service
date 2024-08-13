import type { KnownKeysOnly } from '@cs/database';
import { eq, schema } from '@cs/database';

import type { DbTransactionScope } from '../db-transaction';
import type { Customer, CustomerInsert } from '../entities/customer';
import type { IncludeRelation } from '../services/build-query';
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

  create(entity: CustomerInsert, transactionScope: DbTransactionScope) {
    return transactionScope
      .insert(schema.customers)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<CustomerInsert> & NonNullable<Pick<Customer, 'id'>>,
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
