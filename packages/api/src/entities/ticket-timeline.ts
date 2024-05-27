import type { InferInsertModel, InferSelectModel, schema } from '@cs/database';
import type {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TimelineEntryType,
} from '@cs/kyaku/models/ticket-timeline-entry';

export type TicketTimeline = InferSelectModel<
  typeof schema.ticketTimelineEntries
>;

export type TicketTimelineInsert = InferInsertModel<
  typeof schema.ticketTimelineEntries
>;

export type TicketTimelineUnion =
  | (Omit<TicketTimeline, 'entry' | 'type'> & {
      type: TimelineEntryType.AssignmentChanged;
      entry: TicketAssignmentChanged;
    })
  | (Omit<TicketTimeline, 'entry' | 'type'> & {
      type: TimelineEntryType.Chat;
      entry: TicketChat;
    })
  | (Omit<TicketTimeline, 'entry' | 'type'> & {
      type: TimelineEntryType.LabelsChanged;
      entry: TicketLabelsChanged;
    })
  | (Omit<TicketTimeline, 'entry' | 'type'> & {
      type: TimelineEntryType.Note;
      entry: TicketNote;
    })
  | (Omit<TicketTimeline, 'entry' | 'type'> & {
      type: TimelineEntryType.PriorityChanged;
      entry: TicketPriorityChanged;
    })
  | (Omit<TicketTimeline, 'entry' | 'type'> & {
      type: TimelineEntryType.StatusChanged;
      entry: TicketStatusChanged;
    });

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
