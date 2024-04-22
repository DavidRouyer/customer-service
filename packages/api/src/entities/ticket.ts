import { InferInsertModel, InferSelectModel, schema } from '@cs/database';

import { InclusionFilterOperator } from '../services/build-query';

export type Ticket = InferSelectModel<typeof schema.tickets>;

export type TicketInsert = InferInsertModel<typeof schema.tickets>;

export type TicketWith<T> = {
  assignedTo?: [T] extends [{ assignedTo: true }] ? true : undefined;
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  customer?: [T] extends [{ customer: true }] ? true : undefined;
  labels?: [T] extends [{ labels: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
};

export type TicketFilters = {
  isAssigned?: boolean;
  assignedToUser?: InclusionFilterOperator<NonNullable<Ticket['assignedToId']>>;
  customerIds?: InclusionFilterOperator<Ticket['customerId']>;
  ticketIds?: InclusionFilterOperator<Ticket['id']>;
  priority?: InclusionFilterOperator<Ticket['priority']>;
  status?: InclusionFilterOperator<Ticket['status']>;
};

export enum TicketSortField {
  createdAt = 'createdAt',
  statusChangedAt = 'statusChangedAt',
}
