import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import CustomerRepository from './repositories/customer';
import LabelRepository from './repositories/label';
import LabelTypeRepository from './repositories/label-type';
import TicketRepository from './repositories/ticket';
import TicketTimelineRepository from './repositories/ticket-timeline';
import UserRepository from './repositories/user';
import * as auth from './schemas/auth';
import * as customer from './schemas/customer';
import * as labels from './schemas/label';
import * as labelTypes from './schemas/label-type';
import * as ticket from './schemas/ticket';
import * as ticketTimelineEntries from './schemas/ticket-timeline-entry';

export const schema = {
  ...auth,
  ...customer,
  ...labels,
  ...labelTypes,
  ...ticket,
  ...ticketTimelineEntries,
};

export {
  CustomerRepository,
  LabelRepository,
  LabelTypeRepository,
  TicketTimelineRepository,
  TicketRepository,
  UserRepository,
};

export * from 'drizzle-orm';
export * from './build-query';

const { Pool } = pg;

const databaseClient = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const dbConnection = drizzle(databaseClient, { schema });

export type DbConnection = typeof dbConnection;
