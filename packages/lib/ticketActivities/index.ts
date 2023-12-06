import { TicketPriority } from '../tickets';
import { TicketActivityType } from './TicketActivityType';

type TicketAssignmentChanged = {
  oldAssignedToId: string | null;
  newAssignedToId: string | null;
};

type TicketCommented = {
  text: string;
};

type TicketLabelsChanged = {
  oldLabelIds: string[];
  newLabelIds: string[];
};

type TicketPriorityChanged = {
  oldPriority: TicketPriority;
  newPriority: TicketPriority;
};

export {
  type TicketAssignmentChanged,
  type TicketCommented,
  type TicketLabelsChanged,
  type TicketPriorityChanged,
  TicketActivityType,
};
