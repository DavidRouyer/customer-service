import { DrizzleConnection, eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Ticket, TicketInsert } from '../entities/ticket';
import { BaseRepository } from './base-repository';

type FindTicketInput = Parameters<
  DrizzleConnection['query']['tickets']['findMany']
>;

type ColumnInput = NonNullable<FindTicketInput[0]>['columns'];
type ExtrasInput = NonNullable<FindTicketInput[0]>['extras'];
type WhereInput = NonNullable<FindTicketInput[0]>['where'];
type WithInput = NonNullable<FindTicketInput[0]>['with'];
type RestInput = Omit<
  NonNullable<FindTicketInput[0]>,
  'columns' | 'extras' | 'where' | 'with'
>;

export default class TicketRepository extends BaseRepository {
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
    return this.drizzleConnection.query.tickets.findFirst(config);
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
    return this.drizzleConnection.query.tickets.findMany(config);
  }

  create(entity: TicketInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope
      .insert(schema.tickets)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<TicketInsert> & NonNullable<Pick<Ticket, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.tickets)
      .set(entity)
      .where(eq(schema.tickets.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
