import { eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Customer, CustomerInsert } from '../entities/customer';
import { BaseRepository } from './base-repository';

export default class CustomerRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<
    T extends Parameters<
      (typeof this.dataSource)['query']['customers']['findFirst']
    >,
  >(...[config]: T) {
    return this.dataSource.query.customers.findFirst(config);
  }

  findMany<
    T extends Parameters<
      (typeof this.dataSource)['query']['customers']['findMany']
    >,
  >(...[config]: T) {
    return this.dataSource.query.customers.findMany(config);
  }

  create(entity: CustomerInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope.insert(schema.customers).values(entity);
  }

  update(
    entity: Partial<CustomerInsert> & NonNullable<Pick<Customer, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.customers)
      .set(entity)
      .where(eq(schema.customers.id, entity.id));
  }
}
