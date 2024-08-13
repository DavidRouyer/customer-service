import type { KnownKeysOnly } from '@cs/database';
import { eq, schema } from '@cs/database';

import type { DbTransactionScope } from '../db-transaction';
import type { LabelType, LabelTypeInsert } from '../entities/label-type';
import type { IncludeRelation } from '../services/build-query';
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

  create(entity: LabelTypeInsert, transactionScope: DbTransactionScope) {
    return transactionScope
      .insert(schema.labelTypes)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<LabelTypeInsert> & NonNullable<Pick<LabelType, 'id'>>,
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
