export enum TicketPriority {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum TicketStatus {
  Open = 'Open',
  Done = 'Done',
}

export enum TicketStatusDetail {
  Created = 'Created',
  NewReply = 'NewReply',
  Replied = 'Replied',
}

export enum TicketFilter {
  All = 'all',
  Me = 'me',
  Unassigned = 'unassigned',
  Mentions = 'mentions',
}
