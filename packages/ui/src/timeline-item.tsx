'use client';

import { ReactNode } from 'react';

import {
  TicketAssignmentChangedWithData,
  TicketChat,
  TicketLabelsChangedWithData,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TicketTimelineEntryType,
} from '@cs/kyaku/models';
import { cn } from '@cs/ui';

import { TimelineAssigmentChanged } from './timeline-assignment-changed';
import { TimelineChat } from './timeline-chat';
import { TimelineLabelsChanged } from './timeline-labels-changed';
import { TimelineNote } from './timeline-note';
import { TimelinePriorityChanged } from './timeline-priority-changed';
import { TimelineStatusChanged } from './timeline-status-changed';

type TimelineItem<T extends TicketTimelineEntryType, U> = {
  id: string;
  createdAt: Date;
  customer: {
    avatarUrl: string | null;
    email: string | null;
    id: string;
    name: string | null;
  };
  customerCreatedBy: {
    avatarUrl: string | null;
    email: string | null;
    id: string;
    name: string | null;
  } | null;
  entry: U;
  type: T;
  userCreatedBy: {
    id: string;
    email: string | null;
    name: string | null;
    image: string | null;
  } | null;
};

export type TimelineItemType =
  | TimelineItem<
      TicketTimelineEntryType.AssignmentChanged,
      TicketAssignmentChangedWithData
    >
  | TimelineItem<TicketTimelineEntryType.Chat, TicketChat>
  | TimelineItem<
      TicketTimelineEntryType.LabelsChanged,
      TicketLabelsChangedWithData
    >
  | TimelineItem<TicketTimelineEntryType.Note, TicketNote>
  | TimelineItem<TicketTimelineEntryType.PriorityChanged, TicketPriorityChanged>
  | TimelineItem<TicketTimelineEntryType.StatusChanged, TicketStatusChanged>;

export const TimelineItem = ({
  item,
  nextItemId,
  previousItemId,
}: {
  item: TimelineItemType | undefined;
  nextItemId: string | undefined;
  previousItemId: string | undefined;
}) => {
  if (!item) {
    return null;
  }

  let activity: ReactNode = null;
  if (item.type === TicketTimelineEntryType.Chat) {
    activity = <TimelineChat item={item} />;
  }

  if (item.type === TicketTimelineEntryType.Note) {
    activity = <TimelineNote item={item} />;
  }

  if (item.type === TicketTimelineEntryType.StatusChanged) {
    activity = <TimelineStatusChanged item={item} />;
  }

  if (item.type === TicketTimelineEntryType.AssignmentChanged) {
    activity = <TimelineAssigmentChanged item={item} />;
  }

  if (item.type === TicketTimelineEntryType.LabelsChanged) {
    activity = <TimelineLabelsChanged item={item} />;
  }

  if (item.type === TicketTimelineEntryType.PriorityChanged) {
    activity = <TimelinePriorityChanged item={item} />;
  }

  return (
    <>
      {activity}
      <div className="grid grid-cols-[24px_auto] gap-6">
        <div
          className={cn({
            'm-auto h-full w-0 border-l border-muted-foreground bg-gray-200':
              nextItemId,
          })}
        ></div>
        <div className="mb-6"></div>
      </div>
    </>
  );
};
