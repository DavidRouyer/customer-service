import { Client } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as auth from './schema/auth';
import * as contact from './schema/contact';
import * as message from './schema/message';
import * as ticket from './schema/ticket';

export const schema = { ...auth, ...contact, ...message, ...ticket };

export { pgTable as tableCreator } from './schema/_table';

export * from 'drizzle-orm';

export const db = drizzle(
  new Client({
    connectionString: process.env.DATABASE_URL,
  }),
  { schema }
);
