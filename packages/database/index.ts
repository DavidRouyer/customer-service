import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

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

export * from 'drizzle-orm';

const { Pool } = pg;

const databaseClient = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const dbConnection = drizzle(databaseClient, { schema });

export type DbConnection = typeof dbConnection;
