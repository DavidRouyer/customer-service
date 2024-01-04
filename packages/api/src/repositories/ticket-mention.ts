import { schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { TicketMentionInsert } from '../entities/ticket-mention';
import { BaseRepository } from './base-repository';

export default class TicketMentionRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  findMany(
    ...[config]: Parameters<
      (typeof this.dataSource)['query']['ticketMentions']['findMany']
    >
  ) {
    return this.dataSource.query.ticketMentions.findMany(config);
  }

  create(
    entity: TicketMentionInsert | TicketMentionInsert[],
    transactionScope: DrizzleTransactionScope
  ) {
    if (Array.isArray(entity)) {
      return transactionScope.insert(schema.ticketMentions).values(entity);
    }
    return transactionScope.insert(schema.ticketMentions).values(entity);
  }

  update(
    entity: Partial<TicketMentionInsert>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope.update(schema.ticketMentions).set(entity);
  }
}
