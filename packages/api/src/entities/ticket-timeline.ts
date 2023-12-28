import { db, InferSelectModel, schema } from '@cs/database';
import {
  TicketAssignmentChanged,
  TicketLabelsChanged,
  User,
} from '@cs/kyaku/models';
import { SortDirection } from '@cs/kyaku/types/sort-direction';

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
export type TicketTimelineRelations = NonNullable<
  Parameters<(typeof db)['query']['ticketTimelineEntries']['findFirst']>[0]
>['with'];

export type TicketTimelineSort = { createdAt: SortDirection };
