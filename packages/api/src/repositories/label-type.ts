import { eq, KnownKeysOnly, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { LabelType, LabelTypeInsert } from '../entities/label-type';
import { IncludeRelation } from '../services/build-query';
import { BaseRepository } from './base-repository';

export default class LabelTypeRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'labelTypes'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'labelTypes'>, 'limit'>>
  ) {
    return this.drizzleConnection.query.labelTypes.findFirst(config);
  }

  findMany<T extends KnownKeysOnly<T, IncludeRelation<'users'>>>(config: T) {
    return this.drizzleConnection.query.labelTypes.findMany(config);
  }

  create(entity: LabelTypeInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope
      .insert(schema.labelTypes)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<LabelTypeInsert> & NonNullable<Pick<LabelType, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.labelTypes)
      .set(entity)
      .where(eq(schema.labelTypes.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
