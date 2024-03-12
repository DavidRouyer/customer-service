import { TicketPriority, TicketStatus, User } from '../models';

export enum TicketTimelineEntryType {
  AssignmentChanged = 'AssignmentChanged',
  Chat = 'Chat',
  LabelsChanged = 'LabelsChanged',
  Note = 'Note',
  PriorityChanged = 'PriorityChanged',
  StatusChanged = 'StatusChanged',
}

export type TicketAssignmentChanged = {
  oldAssignedToId: string | null;
  newAssignedToId: string | null;
};

export type TicketChat = {
  text: string;
};

export type TicketLabelsChanged = {
  oldLabelIds: string[];
  newLabelIds: string[];
};

export type TicketNote = {
  text: string;
  rawContent: string;
};

export type TicketPriorityChanged = {
  oldPriority: TicketPriority;
  newPriority: TicketPriority;
};

export type TicketStatusChanged = {
  oldStatus: TicketStatus;
  newStatus: TicketStatus;
};

export type TicketAssignmentChangedWithData = {
  oldAssignedTo?: User | null;
  newAssignedTo?: User | null;
} & TicketAssignmentChanged;

type TicketLabelChanged = {
  id: string;
  ticketId: string;
  labelTypeId: string;
  archivedAt: Date | null;
  labelType: {
    id: string;
    name: string;
    createdAt: Date;
    createdById: string;
    updatedAt: Date | null;
    updatedById: string | null;
    icon: string;
    archivedAt: Date | null;
  };
};

export type TicketLabelsChangedWithData = {
  oldLabels?: TicketLabelChanged[];
  newLabels?: TicketLabelChanged[];
} & TicketLabelsChanged;
