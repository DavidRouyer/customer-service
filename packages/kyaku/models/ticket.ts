export enum TicketPriority {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Medium = 'MEDIUM',
  Low = 'LOW',
}

export enum TicketStatus {
  Open = 'OPEN',
  Done = 'DONE',
}

export enum TicketStatusDetail {
  Created = 'CREATED',
  NewReply = 'NEW_REPLY',
  Replied = 'REPLIED',
}

export enum TicketFilter {
  All = 'all',
  Me = 'me',
  Unassigned = 'unassigned',
  Mentions = 'mentions',
}
