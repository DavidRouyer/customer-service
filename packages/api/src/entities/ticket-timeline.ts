import { InferInsertModel, InferSelectModel, schema } from '@cs/database';

export type TicketTimeline = InferSelectModel<
  typeof schema.ticketTimelineEntries
>;

export type TicketTimelineInsert = InferInsertModel<
  typeof schema.ticketTimelineEntries
>;

export type TicketTimelineWith<T> = {
  assignedTo?: [T] extends [{ assignedTo: true }] ? true : undefined;
  customer?: [T] extends [{ customer: true }] ? true : undefined;
  customerCreatedBy?: [T] extends [{ customerCreatedBy: true }]
    ? true
    : undefined;
  ticket?: [T] extends [{ ticket: true }] ? true : undefined;
  userCreatedBy?: [T] extends [{ userCreatedBy: true }] ? true : undefined;
};

export enum TicketTimelineSortField {
  createdAt = 'createdAt',
}
