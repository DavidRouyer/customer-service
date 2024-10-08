import type { InferInsertModel, InferSelectModel, KnownKeysOnly } from '..';
import type { IncludeRelation } from '../build-query';
import type { DbTransactionScope } from '../db-transaction';
import { eq, schema } from '..';
import { BaseRepository } from './base-repository';

export default class TicketRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'tickets'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'tickets'>, 'limit'>>,
  ) {
    return this.dbConnection.query.tickets.findFirst(config);
  }

  findMany<T extends IncludeRelation<'tickets'>>(
    config: KnownKeysOnly<T, IncludeRelation<'tickets'>>,
  ) {
    return this.dbConnection.query.tickets.findMany(config);
  }

  create(
    entity: InferInsertModel<typeof schema.tickets>,
    transactionScope: DbTransactionScope,
  ) {
    return transactionScope
      .insert(schema.tickets)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<InferInsertModel<typeof schema.tickets>> &
      NonNullable<Pick<InferSelectModel<typeof schema.tickets>, 'id'>>,
    transactionScope: DbTransactionScope,
  ) {
    return transactionScope
      .update(schema.tickets)
      .set(entity)
      .where(eq(schema.tickets.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
