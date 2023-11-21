import { TicketPriority } from '../tickets';
import { TicketActivityType } from './TicketActivityType';

type TicketAssignmentAdded = {
  newAssignedToId: string;
};

type TicketAssignmentChanged = {
  oldAssignedToId: string;
  newAssignedToId: string;
};

type TicketAssignmentRemoved = {
  oldAssignedToId: string;
};

type TicketCommented = {
  comment: string;
};

type TicketLabelAdded = {
  labelTypeIds: string[];
};

type TicketLabelRemoved = {
  labelTypeIds: string[];
};

type TicketPriorityChanged = {
  oldPriority: TicketPriority;
  newPriority: TicketPriority;
};

export {
  type TicketAssignmentAdded,
  type TicketAssignmentChanged,
  type TicketAssignmentRemoved,
  type TicketCommented,
  type TicketLabelAdded,
  type TicketLabelRemoved,
  type TicketPriorityChanged,
  TicketActivityType,
};
