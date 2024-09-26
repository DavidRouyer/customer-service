import type {
  InferInsertModel,
  InferSelectModel,
  KnownKeysOnly,
} from '@kyaku/database';
import { eq, inArray, schema } from '@kyaku/database';

import type { IncludeRelation } from '../build-query';
import type { DbTransactionScope } from '../db-transaction';
import { BaseRepository } from './base-repository';

export default class LabelRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'labels'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'labels'>, 'limit'>>
  ) {
    return this.dbConnection.query.labels.findFirst(config);
  }

  findMany<T extends IncludeRelation<'labels'>>(
    config: KnownKeysOnly<T, IncludeRelation<'labels'>>
  ) {
    return this.dbConnection.query.labels.findMany(config);
  }

  create(
    entity: InferInsertModel<typeof schema.labels>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .insert(schema.labels)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  createMany(
    entities: InferInsertModel<typeof schema.labels>[],
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .insert(schema.labels)
      .values(entities)
      .returning()
      .then((res) => res);
  }

  update(
    entity: Partial<InferInsertModel<typeof schema.labels>> &
      NonNullable<Pick<InferSelectModel<typeof schema.labels>, 'id'>>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .update(schema.labels)
      .set(entity)
      .where(eq(schema.labels.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }

  updateMany(
    entityIds: InferSelectModel<typeof schema.labels>['id'][],
    entity: Omit<Partial<InferInsertModel<typeof schema.labels>>, 'id'>,
    transactionScope: DbTransactionScope
  ) {
    return transactionScope
      .update(schema.labels)
      .set(entity)
      .where(inArray(schema.labels.id, entityIds))
      .returning()
      .then((res) => res);
  }
}
