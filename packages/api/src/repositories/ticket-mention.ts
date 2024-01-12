import { DrizzleConnection, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { TicketMentionInsert } from '../entities/ticket-mention';
import { BaseRepository } from './base-repository';

type FindTicketMentionInput = Parameters<
  DrizzleConnection['query']['ticketMentions']['findMany']
>;

type ColumnInput = NonNullable<FindTicketMentionInput[0]>['columns'];
type ExtrasInput = NonNullable<FindTicketMentionInput[0]>['extras'];
type WhereInput = NonNullable<FindTicketMentionInput[0]>['where'];
type WithInput = NonNullable<FindTicketMentionInput[0]>['with'];
type RestInput = Omit<
  NonNullable<FindTicketMentionInput[0]>,
  'columns' | 'extras' | 'where' | 'with'
>;

export default class TicketMentionRepository extends BaseRepository {
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
    return this.drizzleConnection.query.ticketMentions.findFirst(config);
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
    return this.drizzleConnection.query.ticketMentions.findMany(config);
  }

  create(
    entity: TicketMentionInsert,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .insert(schema.ticketMentions)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  createMany(
    entities: TicketMentionInsert[],
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .insert(schema.ticketMentions)
      .values(entities)
      .returning()
      .then((res) => res);
  }

  update(
    entity: Partial<TicketMentionInsert>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.ticketMentions)
      .set(entity)
      .returning()
      .then((res) => res[0]);
  }
}
