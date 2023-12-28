import { TicketPriority, TicketStatus } from '../models';

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
