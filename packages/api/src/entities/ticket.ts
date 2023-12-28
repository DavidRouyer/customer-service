import { db, InferSelectModel, schema } from '@cs/database';
import { SortDirection } from '@cs/kyaku/types/sort-direction';

export type Ticket = InferSelectModel<typeof schema.tickets>;
export type TicketRelations = NonNullable<
  Parameters<(typeof db)['query']['tickets']['findFirst']>[0]
>['with'];

export type TicketSort =
  | { priority: SortDirection }
  | { createdAt: SortDirection };
