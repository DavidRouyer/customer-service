import type { InferSelectModel, schema } from '@cs/database';

import type { InclusionFilterOperator } from '../../../database/build-query';

export interface TicketWith<T> {
  assignedTo?: [T] extends [{ assignedTo: true }] ? true : undefined;
  createdBy?: [T] extends [{ createdBy: true }] ? true : undefined;
  customer?: [T] extends [{ customer: true }] ? true : undefined;
  labels?: [T] extends [{ labels: true }] ? true : undefined;
  updatedBy?: [T] extends [{ updatedBy: true }] ? true : undefined;
}

type TicketSelectModel = InferSelectModel<typeof schema.tickets>;

export interface TicketFilters {
  isAssigned?: boolean;
  assignedToUser?: InclusionFilterOperator<
    NonNullable<TicketSelectModel['assignedToId']>
  >;
  customerIds?: InclusionFilterOperator<TicketSelectModel['customerId']>;
  ticketIds?: InclusionFilterOperator<TicketSelectModel['id']>;
  priority?: InclusionFilterOperator<TicketSelectModel['priority']>;
  statuses?: InclusionFilterOperator<TicketSelectModel['status']>;
}

export enum TicketSortField {
  createdAt = 'createdAt',
  statusChangedAt = 'statusChangedAt',
}
