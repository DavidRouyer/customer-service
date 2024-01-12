import { DrizzleConnection, eq, inArray, schema } from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { User, UserInsert } from '../entities/user';
import { BaseRepository } from './base-repository';

type FindUserInput = Parameters<
  DrizzleConnection['query']['users']['findMany']
>;

type ColumnInput = NonNullable<FindUserInput[0]>['columns'];
type ExtrasInput = NonNullable<FindUserInput[0]>['extras'];
type WhereInput = NonNullable<FindUserInput[0]>['where'];
type WithInput = NonNullable<FindUserInput[0]>['with'];
type RestInput = Omit<
  NonNullable<FindUserInput[0]>,
  'columns' | 'extras' | 'where' | 'with'
>;

export default class UserRepository extends BaseRepository {
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
    return this.drizzleConnection.query.users.findFirst(config);
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
    return this.drizzleConnection.query.users.findMany(config);
  }

  create(entity: UserInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope
      .insert(schema.users)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<UserInsert> & NonNullable<Pick<User, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.users)
      .set(entity)
      .where(eq(schema.users.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }

  updateMany(
    entityIds: User['id'][],
    entity: Omit<Partial<UserInsert>, 'id'>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.users)
      .set(entity)
      .where(inArray(schema.users.id, entityIds));
  }
}
