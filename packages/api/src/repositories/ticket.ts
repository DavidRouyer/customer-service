import {
  BuildQueryResult,
  DBQueryConfig,
  DrizzleConnection,
  eq,
  ExtractTablesWithRelations,
  KnownKeysOnly,
  schema,
} from '@cs/database';

import { DrizzleTransactionScope } from '../drizzle-transaction';
import { Ticket, TicketInsert } from '../entities/ticket';
import { BaseRepository } from './base-repository';

type DbSchemas = NonNullable<DrizzleConnection['_']['schema']>;

export type SchemaRelations<
  TTableName extends keyof DbSchemas,
  TExcludeRelations extends keyof NonNullable<
    DbSchemas[TTableName]['relations']
  > = never,
> = Exclude<
  keyof NonNullable<DbSchemas[TTableName]['relations']>,
  TExcludeRelations
>;

export type SchemaWithRelations<
  TTableName extends keyof DbSchemas,
  TInclude extends SchemaRelations<TTableName> = never,
> = BuildQueryResult<
  DbSchemas,
  DbSchemas[TTableName],
  { with: { [Key in TInclude]: true } }
>;

/*export type Ticket<T extends SchemaRelations<'tickets'> = never> =
  SchemaWithRelations<'tickets', T>;
export type TicketWithRelations<
  T extends SchemaRelations<
    'tickets',
    | 'assignedTo'
    | 'createdBy'
    | 'customer'
    | 'labels'
    | 'statusChangedBy'
    | 'ticketMentions'
    | 'timelineEntries'
    | 'updatedBy'
  > = never,
> = SchemaWithRelations<'tickets', T>;*/

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  'many',
  boolean,
  TSchema,
  TSchema[TableName]
>;
export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export default class TicketRepository extends BaseRepository {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  find<T extends Omit<IncludeRelation<'tickets'>, 'limit'>>(
    config: KnownKeysOnly<T, Omit<IncludeRelation<'tickets'>, 'limit'>>
  ) {
    return this.drizzleConnection.query.tickets.findFirst(config);
  }

  findMany<T extends KnownKeysOnly<T, IncludeRelation<'tickets'>>>(config: T) {
    return this.drizzleConnection.query.tickets.findMany(config);
  }

  create(entity: TicketInsert, transactionScope: DrizzleTransactionScope) {
    return transactionScope
      .insert(schema.tickets)
      .values(entity)
      .returning()
      .then((res) => res[0]);
  }

  update(
    entity: Partial<TicketInsert> & NonNullable<Pick<Ticket, 'id'>>,
    transactionScope: DrizzleTransactionScope
  ) {
    return transactionScope
      .update(schema.tickets)
      .set(entity)
      .where(eq(schema.tickets.id, entity.id))
      .returning()
      .then((res) => res[0]);
  }
}
