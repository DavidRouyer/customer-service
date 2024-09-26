import type {
  InferInsertModel,
  InferSelectModel,
  KnownKeysOnly,
} from '@kyaku/database';
import { eq, schema } from '@kyaku/database';

import type { IncludeRelation } from '../build-query';
import type { DbTransactionScope } from '../db-transaction';
import { BaseRepository } from './base-repository';

export default class LabelTypeRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'labelTypes'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'labelTypes'>, 'limit'>>
  ) {
    return this.dbConnection.query.labelTypes.findFirst(config);
  }

  findMany<T extends IncludeRelation<'labelTypes'>>(
    config: KnownKeysOnly<T, IncludeRelation<'labelTypes'>>
  ) {
    return this.dbConnection.query.labelTypes.findMany(config);
  }

  create(
    entity: InferInsertModel<typeof schema.labelTypes>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .insert(schema.labelTypes)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<InferInsertModel<typeof schema.labelTypes>> &
      NonNullable<Pick<InferSelectModel<typeof schema.labelTypes>, 'id'>>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .update(schema.labelTypes)
      .set(entity)
      .where(eq(schema.labelTypes.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
