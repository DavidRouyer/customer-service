import { TicketPriority, TicketStatus } from '../tickets';
import { TicketTimelineEntryType } from './TicketTimelineEntryType';

type TicketAssignmentChanged = {
  oldAssignedToId: string | null;
  newAssignedToId: string | null;
};

type TicketChat = {
  text: string;
};

type TicketLabelsChanged = {
  oldLabelIds: string[];
  newLabelIds: string[];
};

type TicketNote = {
  text: string;
  rawContent: string;
};

type TicketPriorityChanged = {
  oldPriority: TicketPriority;
  newPriority: TicketPriority;
};

type TicketStatusChanged = {
  oldStatus: TicketStatus;
  newStatus: TicketStatus;
};

export {
  type TicketAssignmentChanged,
  type TicketChat,
  type TicketLabelsChanged,
  type TicketNote,
  type TicketPriorityChanged,
  type TicketStatusChanged,
  TicketTimelineEntryType,
};
