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

export {
  type TicketAssignmentAdded,
  type TicketAssignmentChanged,
  type TicketAssignmentRemoved,
  type TicketCommented,
  TicketActivityType,
};
