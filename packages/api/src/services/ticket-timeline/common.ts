export interface TicketTimelineWith<T> {
  assignedTo?: [T] extends [{ assignedTo: true }] ? true : undefined;
  customer?: [T] extends [{ customer: true }] ? true : undefined;
  customerCreatedBy?: [T] extends [{ customerCreatedBy: true }]
    ? true
    : undefined;
  ticket?: [T] extends [{ ticket: true }] ? true : undefined;
  userCreatedBy?: [T] extends [{ userCreatedBy: true }] ? true : undefined;
}

export enum TicketTimelineSortField {
  createdAt = 'createdAt',
}
