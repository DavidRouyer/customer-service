import { DrizzleConnection, eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import {
  TicketTimeline,
  TicketTimelineInsert,
} from '../entities/ticket-timeline';
import { BaseRepository } from './base-repository';

type FindTicketTimelineInput = Parameters<
  DrizzleConnection['query']['ticketTimelineEntries']['findMany']
>;

type ColumnInput = NonNullable<FindTicketTimelineInput[0]>['columns'];
type ExtrasInput = NonNullable<FindTicketTimelineInput[0]>['extras'];
type WhereInput = NonNullable<FindTicketTimelineInput[0]>['where'];
type WithInput = NonNullable<FindTicketTimelineInput[0]>['with'];
type RestInput = Omit<
  NonNullable<FindTicketTimelineInput[0]>,
  'columns' | 'extras' | 'where' | 'with'
>;

export default class TicketTimelineRepository extends BaseRepository {
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
    return this.drizzleConnection.query.ticketTimelineEntries.findFirst(config);
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
    return this.drizzleConnection.query.ticketTimelineEntries.findMany(config);
  }

  create(
    entity: TicketTimelineInsert,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .insert(schema.ticketTimelineEntries)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<TicketTimelineInsert> &
      NonNullable<Pick<TicketTimeline, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.ticketTimelineEntries)
      .set(entity)
      .where(eq(schema.ticketTimelineEntries.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
