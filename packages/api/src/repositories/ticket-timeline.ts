import { eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import {
  TicketTimeline,
  TicketTimelineInsert,
} from '../entities/ticket-timeline';
import { BaseRepository } from './base-repository';

export default class TicketTimelineRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<
    T extends Parameters<
      (typeof this.dataSource)['query']['ticketTimelineEntries']['findFirst']
    >,
  >(...[config]: T) {
    return this.dataSource.query.ticketTimelineEntries.findFirst(config);
  }

  findMany<
    T extends Parameters<
      (typeof this.dataSource)['query']['ticketTimelineEntries']['findMany']
    >,
  >(...[config]: T) {
    return this.dataSource.query.ticketTimelineEntries.findMany(config);
  }

  create(
    entity: TicketTimelineInsert,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope.insert(schema.ticketTimelineEntries).values(entity);
  }

  update(
    entity: Partial<TicketTimelineInsert> &
      NonNullable<Pick<TicketTimeline, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.ticketTimelineEntries)
      .set(entity)
      .where(eq(schema.ticketTimelineEntries.id, entity.id));
  }
}
