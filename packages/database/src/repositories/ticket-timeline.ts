import type { InferInsertModel, InferSelectModel, KnownKeysOnly } from '..';
import type { IncludeRelation } from '../build-query';
import type { DbTransactionScope } from '../db-transaction';
import { eq, schema } from '..';
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
    >,
  ) {
    return this.dbConnection.query.ticketTimelineEntries.findFirst(config);
  }

  findMany<T extends IncludeRelation<'ticketTimelineEntries'>>(
    config: KnownKeysOnly<T, IncludeRelation<'ticketTimelineEntries'>>,
  ) {
    return this.dbConnection.query.ticketTimelineEntries.findMany(config);
  }

  create(
    entity: InferInsertModel<typeof schema.ticketTimelineEntries>,
    transactionScope: DbTransactionScope,
  ) {
    return transactionScope
      .insert(schema.ticketTimelineEntries)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<InferInsertModel<typeof schema.ticketTimelineEntries>> &
      NonNullable<
        Pick<InferSelectModel<typeof schema.ticketTimelineEntries>, 'id'>
      >,
    transactionScope: DbTransactionScope,
  ) {
    return transactionScope
      .update(schema.ticketTimelineEntries)
      .set(entity)
      .where(eq(schema.ticketTimelineEntries.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
