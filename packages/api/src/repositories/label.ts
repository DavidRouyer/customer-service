import { schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { LabelInsert } from '../entities/label';
import { BaseRepository } from './base-repository';

export default class LabelRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  findMany(
    ...[config]: Parameters<
      (typeof this.dataSource)['query']['labels']['findMany']
    >
  ) {
    return this.dataSource.query.labels.findMany(config);
  }

  create(
    entity: LabelInsert | LabelInsert[],
    transactionScope: DrizzleTransactionScope
  ) {
    if (Array.isArray(entity)) {
      return transactionScope.insert(schema.labels).values(entity);
    }
    return transactionScope.insert(schema.labels).values(entity);
  }

  update(
    entity: Partial<LabelInsert>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope.update(schema.labels).set(entity);
  }
}
