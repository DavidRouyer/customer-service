import type { InferSelectModel, schema } from '@cs/database';
import type {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TimelineEntryType,
} from '@cs/kyaku/models';

type TicketTimelineSelectModel = InferSelectModel<
  typeof schema.ticketTimelineEntries
>;

export type TicketTimelineUnion = Omit<
  TicketTimelineSelectModel,
  'entry' | 'type'
> &
  (
    | {
        type: TimelineEntryType.AssignmentChanged;
        entry: TicketAssignmentChanged;
      }
    | {
        type: TimelineEntryType.Chat;
        entry: TicketChat;
      }
    | {
        type: TimelineEntryType.LabelsChanged;
        entry: TicketLabelsChanged;
      }
    | {
        type: TimelineEntryType.Note;
        entry: TicketNote;
      }
    | {
        type: TimelineEntryType.PriorityChanged;
        entry: TicketPriorityChanged;
      }
    | {
        type: TimelineEntryType.StatusChanged;
        entry: TicketStatusChanged;
      }
  );

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
