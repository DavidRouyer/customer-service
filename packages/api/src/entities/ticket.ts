import { db, InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';
import { GetConfig } from '@cs/kyaku/types/query';

import {
  InclusionFilterOperator,
  QuantityFilterOperator,
} from '../services/build-query';

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
  | { statusChangedAt: SortDirection }
  | { createdAt: SortDirection };
export type TicketCursor = {
  statusChangedAt?: string;
  createdAt?: string;
  id: string;
};
export type TicketFilters = {
  assignedToId?: NonNullable<Ticket['assignedToId']>[] | null;
  createdAt?: QuantityFilterOperator<Ticket['createdAt']>;
  customerId?: Ticket['customerId'];
  id?: InclusionFilterOperator<Ticket['id']>;
  status?: Ticket['status'];
};
