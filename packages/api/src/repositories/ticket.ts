import { eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Ticket, TicketInsert } from '../entities/ticket';
import { BaseRepository } from './base-repository';

export default class TicketRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  findMany(
    ...[config]: Parameters<
      (typeof this.dataSource)['query']['tickets']['findMany']
    >
  ) {
    return this.dataSource.query.tickets.findMany(config);
  }

  create(entity: TicketInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope.insert(schema.tickets).values(entity);
  }

  update(
    entity: Partial<TicketInsert> & NonNullable<Pick<Ticket, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.tickets)
      .set(entity)
      .where(eq(schema.tickets.id, entity.id));
  }
}
