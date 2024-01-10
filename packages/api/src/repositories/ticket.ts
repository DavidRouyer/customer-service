import { eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Ticket, TicketInsert } from '../entities/ticket';
import { BaseRepository } from './base-repository';

export default class TicketRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<
    T extends Parameters<
      (typeof this.drizzleConnection)['query']['tickets']['findFirst']
    >,
  >(...[config]: T) {
    return this.drizzleConnection.query.tickets.findFirst(config);
  }

  findMany<
    T extends Parameters<
      (typeof this.drizzleConnection)['query']['tickets']['findMany']
    >,
  >(...[config]: T) {
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
