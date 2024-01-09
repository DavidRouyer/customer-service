import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as auth from './schema/auth';
import * as customer from './schema/customer';
import * as labels from './schema/label';
import * as labelTypes from './schema/label-type';
import * as ticket from './schema/ticket';
import * as ticketMentions from './schema/ticket-mentions';
import * as ticketTimelineEntries from './schema/ticket-timeline-entry';

export const schema = {
  ...auth,
  ...customer,
  ...labels,
  ...labelTypes,
  ...ticket,
  ...ticketMentions,
  ...ticketTimelineEntries,
};

export { pgTable as tableCreator } from 'drizzle-orm/pg-core';

export * from 'drizzle-orm';

const databaseClient = new Pool({
  connectionString: process.env.DATABASE_URL,
  maxUses: typeof EdgeRuntime !== 'undefined' ? 1 : undefined,
});

export const drizzleConnection = drizzle(databaseClient, { schema });

export type DrizzleConnection = typeof drizzleConnection;
