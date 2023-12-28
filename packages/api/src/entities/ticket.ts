import { db, InferSelectModel, schema } from '@cs/database';

import { SortDirection } from './sort-direction';

export type Ticket = InferSelectModel<typeof schema.tickets>;
export type TicketRelations = Omit<
  NonNullable<
    Parameters<(typeof db)['query']['tickets']['findFirst']>[0]
  >['with'],
  'timeline'
> & { timeline?: boolean };

export type TicketSort =
  | { priority: SortDirection }
  | { createdAt: SortDirection };
