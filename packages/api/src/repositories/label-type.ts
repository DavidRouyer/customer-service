import { DrizzleConnection, eq, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { LabelType, LabelTypeInsert } from '../entities/label-type';
import { BaseRepository } from './base-repository';

type FindLabelTypeInput = Parameters<
  DrizzleConnection['query']['labelTypes']['findMany']
>;

type ColumnInput = NonNullable<FindLabelTypeInput[0]>['columns'];
type ExtrasInput = NonNullable<FindLabelTypeInput[0]>['extras'];
type WhereInput = NonNullable<FindLabelTypeInput[0]>['where'];
type WithInput = NonNullable<FindLabelTypeInput[0]>['with'];
type RestInput = Omit<
  NonNullable<FindLabelTypeInput[0]>,
  'columns' | 'extras' | 'where' | 'with'
>;

export default class LabelTypeRepository extends BaseRepository {
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
    return this.drizzleConnection.query.labelTypes.findFirst(config);
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
