import { db, InferSelectModel, schema } from '@cs/database';

import { SortDirection } from './ticket';

export type TicketTimeline = InferSelectModel<
  typeof schema.ticketTimelineEntries
>;
export type TicketTimelineRelations = NonNullable<
  Parameters<(typeof db)['query']['ticketTimelineEntries']['findFirst']>[0]
>['with'];

export type TicketTimelineSort = { createdAt: SortDirection };
