import { eq, inArray, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Label, LabelInsert } from '../entities/label';
import { BaseRepository } from './base-repository';

export default class LabelRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<
    T extends Parameters<
      (typeof this.dataSource)['query']['labels']['findFirst']
    >,
  >(...[config]: T) {
    return this.dataSource.query.labels.findFirst(config);
  }

  findMany<
    T extends Parameters<
      (typeof this.dataSource)['query']['labels']['findMany']
    >,
  >(...[config]: T) {
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
    entity: Partial<LabelInsert> & NonNullable<Pick<Label, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.labels)
      .set(entity)
      .where(eq(schema.labels.id, entity.id));
  }

  updateMany(
    entityIds: Label['id'][],
    entity: Omit<Partial<LabelInsert>, 'id'>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.labels)
      .set(entity)
      .where(inArray(schema.labels.id, entityIds));
  }
}
