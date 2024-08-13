import type { KnownKeysOnly } from '@cs/database';
import { eq, schema } from '@cs/database';

import type { DbTransactionScope } from '../db-transaction';
import type { Ticket, TicketInsert } from '../entities/ticket';
import type { IncludeRelation } from '../services/build-query';
import { BaseRepository } from './base-repository';

export default class TicketRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'tickets'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'tickets'>, 'limit'>>
  ) {
    return this.dbConnection.query.tickets.findFirst(config);
  }

  findMany<T extends IncludeRelation<'tickets'>>(
    config: KnownKeysOnly<T, IncludeRelation<'tickets'>>
  ) {
    return this.dbConnection.query.tickets.findMany(config);
  }

  create(entity: TicketInsert, transactionScope: DbTransactionScope) {
    return transactionScope
      .insert(schema.tickets)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<TicketInsert> & NonNullable<Pick<Ticket, 'id'>>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .update(schema.tickets)
      .set(entity)
      .where(eq(schema.tickets.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
