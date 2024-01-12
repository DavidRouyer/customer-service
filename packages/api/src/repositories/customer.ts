import { DrizzleConnection, eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Customer, CustomerInsert } from '../entities/customer';
import { BaseRepository } from './base-repository';

type FindCustomerInput = Parameters<
  DrizzleConnection['query']['customers']['findMany']
>;

type ColumnInput = NonNullable<FindCustomerInput[0]>['columns'];
type ExtrasInput = NonNullable<FindCustomerInput[0]>['extras'];
type WhereInput = NonNullable<FindCustomerInput[0]>['where'];
type WithInput = NonNullable<FindCustomerInput[0]>['with'];
type RestInput = Omit<
  NonNullable<FindCustomerInput[0]>,
  'columns' | 'extras' | 'where' | 'with'
>;

export default class CustomerRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<
    TColumn extends ColumnInput,
    TExtras extends ExtrasInput,
    TWhere extends WhereInput,
    TWith extends WithInput,
  >(config: { columns: TColumn; extras: TExtras; where: TWhere; with: TWith }) {
    return this.drizzleConnection.query.customers.findFirst(config);
  }

  findMany<
    TColumn extends ColumnInput,
    TExtras extends ExtrasInput,
    TWhere extends WhereInput,
    TWith extends WithInput,
  >(
    config: {
      columns: TColumn;
      extras: TExtras;
      where: TWhere;
      with: TWith;
    } & RestInput
  ) {
    return this.drizzleConnection.query.customers.findMany(config);
  }

  create(entity: CustomerInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope
      .insert(schema.customers)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<CustomerInsert> & NonNullable<Pick<Customer, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.customers)
      .set(entity)
      .where(eq(schema.customers.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
