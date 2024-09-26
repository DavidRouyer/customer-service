import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core';

import type { schema } from '.';

export type DbTransactionScope = PgTransaction<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
