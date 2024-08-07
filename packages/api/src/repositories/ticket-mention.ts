import type { KnownKeysOnly } from '@cs/database';
import { schema } from '@cs/database';

import type { DrizzleTransactionScope } from '../drizzle-transaction';
import type { TicketMentionInsert } from '../entities/ticket-mention';
import type { IncludeRelation } from '../services/build-query';
import { BaseRepository } from './base-repository';

export default class TicketMentionRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'ticketMentions'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'ticketMentions'>, 'limit'>>
  ) {
    return this.drizzleConnection.query.ticketMentions.findFirst(config);
  }

  findMany<T extends IncludeRelation<'ticketMentions'>>(
    config: KnownKeysOnly<T, IncludeRelation<'ticketMentions'>>
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
