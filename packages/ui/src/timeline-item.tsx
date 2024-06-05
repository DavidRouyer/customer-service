'use client';

import type { ReactNode } from 'react';

import type {
  TicketAssignmentChangedWithData,
  TicketChat,
  TicketLabelsChangedWithData,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
} from '@cs/kyaku/models';
import { cn } from '@cs/ui';

import { TimelineAssigmentChanged } from './timeline-assignment-changed';
import { TimelineChat } from './timeline-chat';
import { TimelineLabelsChanged } from './timeline-labels-changed';
import { TimelineNote } from './timeline-note';
import { TimelinePriorityChanged } from './timeline-priority-changed';
import { TimelineStatusChanged } from './timeline-status-changed';

export type AssignmentChangedEntry = {
  __typename: 'AssignmentChangedEntry';
} & TicketAssignmentChangedWithData;

export type ChatEntry = {
  __typename: 'ChatEntry';
} & TicketChat;

export type LabelsChangedEntry = {
  __typename: 'LabelsChangedEntry';
} & TicketLabelsChangedWithData;

export type NoteEntry = {
  __typename: 'NoteEntry';
} & TicketNote;

export type PriorityChangedEntry = {
  __typename: 'PriorityChangedEntry';
} & TicketPriorityChanged;

export type StatusChangedEntry = {
  __typename: 'StatusChangedEntry';
} & TicketStatusChanged;

export interface TimelineItem {
  id: string;
  createdAt: string;
  customer?: {
    avatarUrl?: string | null;
    email?: string | null;
    id: string;
    name?: string | null;
  };
  customerCreatedBy?: {
    avatarUrl?: string | null;
    email?: string | null;
    id: string;
    name?: string | null;
  } | null;
  entry:
    | AssignmentChangedEntry
    | ChatEntry
    | LabelsChangedEntry
    | NoteEntry
    | PriorityChangedEntry
    | StatusChangedEntry;
  userCreatedBy: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  } | null;
}

export type TimelineItemNarrowed<T> = Omit<TimelineItem, 'entry'> & {
  entry: T;
};

export const TimelineItem = ({
  item,
  nextItemId,
  previousItemId,
}: {
  item: TimelineItem;
  nextItemId: string | undefined;
  previousItemId: string | undefined;
}) => {
  console.log(previousItemId);

  let activity: ReactNode = null;
  if (item.entry.__typename === 'ChatEntry') {
    activity = <TimelineChat item={item as TimelineItemNarrowed<ChatEntry>} />;
  }

  if (item.entry.__typename === 'NoteEntry') {
    activity = <TimelineNote item={item as TimelineItemNarrowed<NoteEntry>} />;
  }

  if (item.entry.__typename === 'StatusChangedEntry') {
    activity = (
      <TimelineStatusChanged
        item={item as TimelineItemNarrowed<StatusChangedEntry>}
      />
    );
  }

  if (item.entry.__typename === 'AssignmentChangedEntry') {
    activity = (
      <TimelineAssigmentChanged
        item={item as TimelineItemNarrowed<AssignmentChangedEntry>}
      />
    );
  }

  if (item.entry.__typename === 'LabelsChangedEntry') {
    activity = (
      <TimelineLabelsChanged
        item={item as TimelineItemNarrowed<LabelsChangedEntry>}
      />
    );
  }

  if (item.entry.__typename === 'PriorityChangedEntry') {
    activity = (
      <TimelinePriorityChanged
        item={item as TimelineItemNarrowed<PriorityChangedEntry>}
      />
    );
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
