import { eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { LabelType, LabelTypeInsert } from '../entities/label-type';
import { BaseRepository } from './base-repository';

export default class LabelTypeRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  findMany(
    ...[config]: Parameters<
      (typeof this.dataSource)['query']['labelTypes']['findMany']
    >
  ) {
    return this.dataSource.query.labelTypes.findMany(config);
  }

  create(entity: LabelTypeInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope.insert(schema.labelTypes).values(entity);
  }

  update(
    entity: Partial<LabelTypeInsert> & NonNullable<Pick<LabelType, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.labelTypes)
      .set(entity)
      .where(eq(schema.labelTypes.id, entity.id));
  }
}
