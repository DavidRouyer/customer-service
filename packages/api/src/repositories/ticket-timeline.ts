import { schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { TicketTimelineInsert } from '../entities/ticket-timeline';
import { BaseRepository } from './base-repository';

export default class TicketTimelineRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  findMany(
    ...[config]: Parameters<
      (typeof this.dataSource)['query']['ticketTimelineEntries']['findMany']
    >
  ) {
    return this.dataSource.query.ticketTimelineEntries.findMany(config);
  }

  create(
    entity: TicketTimelineInsert,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope.insert(schema.ticketTimelineEntries).values(entity);
  }

  update(
    entity: Partial<TicketTimelineInsert>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope.update(schema.ticketTimelineEntries).set(entity);
  }
}
