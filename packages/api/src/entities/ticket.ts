import { InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';
import { GetConfig } from '@cs/kyaku/types/query';

import { InclusionFilterOperator } from '../services/build-query';

export type Ticket = InferSelectModel<typeof schema.tickets>;
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
  | { statusChangedAt: SortDirection }
  | { createdAt: SortDirection };
export type TicketCursor = {
  statusChangedAt?: string;
  createdAt?: string;
  id: string;
};
export type TicketFilters = {
  isAssigned?: boolean;
  assignedToUser?: InclusionFilterOperator<NonNullable<Ticket['assignedToId']>>;
  customerId?: InclusionFilterOperator<Ticket['customerId']>;
  ticketId?: InclusionFilterOperator<Ticket['id']>;
  priority?: InclusionFilterOperator<Ticket['priority']>;
  status?: InclusionFilterOperator<Ticket['status']>;
};
