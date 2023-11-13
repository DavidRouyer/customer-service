import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as auth from './schema/auth';
import * as contact from './schema/contact';
import * as contactsToTicketComments from './schema/contactsToTicketComments';
import * as labels from './schema/label';
import * as labelTypes from './schema/labelType';
import * as message from './schema/message';
import * as ticket from './schema/ticket';
import * as ticketActivities from './schema/ticketActivity';
import * as ticketComments from './schema/ticketComment';

export const schema = {
  ...auth,
  ...contact,
  ...contactsToTicketComments,
  ...labels,
  ...labelTypes,
  ...message,
  ...ticket,
  ...ticketActivities,
  ...ticketComments,
};

export { pgTable as tableCreator } from './schema/_table';

export * from 'drizzle-orm';

export const db = drizzle(
  new Pool({
    connectionString: process.env.DATABASE_URL,
    maxUses: typeof EdgeRuntime !== 'undefined' ? 1 : undefined,
  }),
  { schema }
);
