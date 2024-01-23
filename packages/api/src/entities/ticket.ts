import { InferInsertModel, InferSelectModel, schema } from '@cs/database';
import { FindConfig, SortDirection } from '@cs/kyaku/types';
import { GetConfig } from '@cs/kyaku/types/query';

import { InclusionFilterOperator } from '../services/build-query';

export type Ticket = InferSelectModel<typeof schema.tickets>;
export type TicketInsert = InferInsertModel<typeof schema.tickets>;
export type GetTicketConfig = GetConfig<TicketRelations>;
export type TicketRelations = {
  assignedTo?: boolean;
  createdBy?: boolean;
  customer?: boolean;
  labels?: boolean;
  updatedBy?: boolean;
};
export type TicketWith<T> = {
  assignedTo?: [T] extends [{ assignedTo: true }] ? true : undefined;
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  customer?: [T] extends [{ customer: true }] ? true : undefined;
  labels?: [T] extends [{ labels: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
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
