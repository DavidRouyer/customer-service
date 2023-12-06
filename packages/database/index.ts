import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as auth from './schema/auth';
import * as contact from './schema/contact';
import * as labels from './schema/label';
import * as labelTypes from './schema/labelType';
import * as ticket from './schema/ticket';
import * as ticketActivities from './schema/ticketActivity';
import * as ticketChat from './schema/ticketChat';
import * as ticketMentions from './schema/ticketMentions';
import * as ticketNotes from './schema/ticketNote';

export const schema = {
  ...auth,
  ...contact,
  ...labels,
  ...labelTypes,
  ...ticket,
  ...ticketActivities,
  ...ticketChat,
  ...ticketMentions,
  ...ticketNotes,
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
