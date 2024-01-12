import { DrizzleConnection, eq, inArray, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Label, LabelInsert } from '../entities/label';
import { BaseRepository } from './base-repository';

type FindLabelInput = Parameters<
  DrizzleConnection['query']['labels']['findMany']
>;

type ColumnInput = NonNullable<FindLabelInput[0]>['columns'];
type ExtrasInput = NonNullable<FindLabelInput[0]>['extras'];
type WhereInput = NonNullable<FindLabelInput[0]>['where'];
type WithInput = NonNullable<FindLabelInput[0]>['with'];
type RestInput = Omit<
  NonNullable<FindLabelInput[0]>,
  'columns' | 'extras' | 'where' | 'with'
>;

export default class LabelRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<
    TColumn extends ColumnInput,
    TExtras extends ExtrasInput,
    TWhere extends WhereInput,
    TWith extends WithInput,
  >(config: { columns: TColumn; extras: TExtras; where: TWhere; with: TWith }) {
    return this.drizzleConnection.query.labels.findFirst(config);
  }

  findMany<
    TColumn extends ColumnInput,
    TExtras extends ExtrasInput,
    TWhere extends WhereInput,
    TWith extends WithInput,
  >(
    config: {
      columns: TColumn;
      extras: TExtras;
      where: TWhere;
      with: TWith;
    } & RestInput
  ) {
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
