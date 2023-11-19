import { TicketPriority } from '../tickets';
import { TicketActivityType } from './TicketActivityType';

type TicketAssignmentAdded = {
  newAssignedToId: number;
};

type TicketAssignmentChanged = {
  oldAssignedToId: number;
  newAssignedToId: number;
};

type TicketAssignmentRemoved = {
  oldAssignedToId: number;
};

type TicketCommented = {
  comment: string;
};

type TicketLabelAdded = {
  labelTypeIds: number[];
};

type TicketLabelRemoved = {
  labelTypeIds: number[];
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
