import { eq, inArray, KnownKeysOnly, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Label, LabelInsert } from '../entities/label';
import { IncludeRelation } from '../services/build-query';
import { BaseRepository } from './base-repository';

export default class LabelRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'labels'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'labels'>, 'limit'>>
  ) {
    return this.drizzleConnection.query.labels.findFirst(config);
  }

  findMany<T extends KnownKeysOnly<T, IncludeRelation<'labels'>>>(config: T) {
    return this.drizzleConnection.query.labels.findMany(config);
  }

  create(entity: LabelInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope
      .insert(schema.labels)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  createMany(
    entities: LabelInsert[],
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .insert(schema.labels)
      .values(entities)
      .returning()
      .then((res) => res);
  }

  update(
    entity: Partial<LabelInsert> & NonNullable<Pick<Label, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.labels)
      .set(entity)
      .where(eq(schema.labels.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }

  updateMany(
    entityIds: Label['id'][],
    entity: Omit<Partial<LabelInsert>, 'id'>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.labels)
      .set(entity)
      .where(inArray(schema.labels.id, entityIds))
      .returning()
      .then((res) => res);
  }
}
