import type { TicketPriority, TicketStatus, User } from '../models';

export enum TimelineEntryType {
  AssignmentChanged = 'ASSIGNMENT_CHANGED',
  Chat = 'CHAT',
  LabelsChanged = 'LABELS_CHANGED',
  Note = 'NOTE',
  PriorityChanged = 'PRIORITY_CHANGED',
  StatusChanged = 'STATUS_CHANGED',
}

export interface TicketAssignmentChanged {
  oldAssignedToId: string | null;
  newAssignedToId: string | null;
}

export interface TicketChat {
  text: string;
}

export interface TicketLabelsChanged {
  oldLabelIds: string[];
  newLabelIds: string[];
}

export interface TicketNote {
  text: string;
  rawContent: string;
}

export interface TicketPriorityChanged {
  oldPriority: TicketPriority;
  newPriority: TicketPriority;
}

export interface TicketStatusChanged {
  oldStatus: TicketStatus;
  newStatus: TicketStatus;
}

export type TicketAssignmentChangedWithData = {
  oldAssignedTo?: User | null;
  newAssignedTo?: User | null;
} & TicketAssignmentChanged;

interface TicketLabelChanged {
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
}

export type TicketLabelsChangedWithData = {
  oldLabels?: TicketLabelChanged[];
  newLabels?: TicketLabelChanged[];
} & TicketLabelsChanged;
