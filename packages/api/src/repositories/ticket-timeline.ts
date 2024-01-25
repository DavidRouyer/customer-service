import { eq, KnownKeysOnly, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import {
  TicketTimeline,
  TicketTimelineInsert,
} from '../entities/ticket-timeline';
import { IncludeRelation } from '../services/build-query';
import { BaseRepository } from './base-repository';

export default class TicketTimelineRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'ticketTimelineEntries'>, 'limit'>>(
    config: KnownKeysOnly<
      T,
      Omit<IncludeRelation<'ticketTimelineEntries'>, 'limit'>
    >
  ) {
    return this.drizzleConnection.query.ticketTimelineEntries.findFirst(config);
  }

  findMany<T extends IncludeRelation<'ticketTimelineEntries'>>(
    config: KnownKeysOnly<T, IncludeRelation<'ticketTimelineEntries'>>
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
