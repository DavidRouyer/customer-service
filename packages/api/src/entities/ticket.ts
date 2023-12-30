import { db, InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';
import { GetConfig } from '@cs/kyaku/types/query';

export type Ticket = InferSelectModel<typeof schema.tickets>;
export type DbTicketRelations = NonNullable<
  Parameters<(typeof db)['query']['tickets']['findFirst']>[0]
>['with'];
export type GetTicketConfig = GetConfig<TicketRelations>;
export type TicketRelations = {
  createdBy?: boolean;
  updatedBy?: boolean;
  customer?: boolean;
  lastTimelineEntry?: boolean;
  labels?: boolean;
  assignedTo?: boolean;
};
export type FindTicketConfig = FindConfig<TicketRelations, TicketSort>;

export type TicketSort =
  | { priority: SortDirection }
  | { createdAt: SortDirection };
