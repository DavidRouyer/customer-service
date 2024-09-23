export enum TicketPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
}

export enum TicketStatus {
  Done = 'DONE',
  Snoozed = 'SNOOZED',
  Todo = 'TODO',
}

export enum DoneTicketStatusDetail {
  DoneAutomaticallySet = 'DONE_AUTOMATICALLY_SET',
  DoneManuallySet = 'DONE_MANUALLY_SET',
  Ignored = 'IGNORED',
}

export enum SnoozeTicketStatusDetail {
  WaitingForCustomer = 'WAITING_FOR_CUSTOMER',
  WaitingForDuration = 'WAITING_FOR_DURATION',
}

export enum TodoTicketStatusDetail {
  CloseTheLoop = 'CLOSE_THE_LOOP',
  Created = 'CREATED',
  InProgress = 'IN_PROGRESS',
  NewReply = 'NEW_REPLY',
}

export type TicketStatusDetail =
  | DoneTicketStatusDetail
  | SnoozeTicketStatusDetail
  | TodoTicketStatusDetail;

export enum TicketFilter {
  All = 'all',
  Me = 'me',
  Mentions = 'mentions',
  Unassigned = 'unassigned',
}
