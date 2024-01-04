import { InferInsertModel, InferSelectModel, schema } from '@cs/database';
import {
  TicketAssignmentChanged,
  TicketLabelsChanged,
  User,
} from '@cs/kyaku/models';
import { FindConfig, SortDirection } from '@cs/kyaku/types';

export type TicketAssignmentChangedWithData = {
  oldAssignedTo?: User | null;
  newAssignedTo?: User | null;
} & TicketAssignmentChanged;

export type TicketLabelsChangedWithData = {
  oldLabels?: (InferSelectModel<typeof schema.labels> & {
    labelType: InferSelectModel<typeof schema.labelTypes>;
  })[];
  newLabels?: (InferSelectModel<typeof schema.labels> & {
    labelType: InferSelectModel<typeof schema.labelTypes>;
  })[];
} & TicketLabelsChanged;

export type TicketTimeline = InferSelectModel<
  typeof schema.ticketTimelineEntries
>;
export type TicketTimelineInsert = InferInsertModel<
  typeof schema.ticketTimelineEntries
>;
export type TicketTimelineRelations = {
  customer?: boolean;
  customerCreatedBy?: boolean;
  ticket?: boolean;
  userCreatedBy?: boolean;
};
export type FindTicketTimelineConfig = FindConfig<
  TicketTimelineRelations,
  TicketTimelineSort
>;

export type TicketTimelineSort = { createdAt: SortDirection };
