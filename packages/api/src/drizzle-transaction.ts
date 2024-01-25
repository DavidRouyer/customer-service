import { ExtractTablesWithRelations } from 'drizzle-orm';
import { NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import { PgTransaction } from 'drizzle-orm/pg-core';

import { schema } from '@cs/database';

export type DrizzleTransactionScope = PgTransaction<
  NeonQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
