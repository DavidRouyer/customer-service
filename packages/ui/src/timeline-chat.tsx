import { FC } from 'react';

import { TicketChat } from '@cs/kyaku/models';
import { getInitials } from '@cs/kyaku/utils';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { RelativeTime } from './relative-time';
import { TimelineItemType } from './timeline-item';

type TimelineChatType = {
  entry: TicketChat;
} & Omit<TimelineItemType, 'entry'>;

type TimelineChatProps = {
  item: TimelineChatType;
};

export const TimelineChat: FC<TimelineChatProps> = ({ item }) => {
  return (
    <div className="my-2 flex">
      <div className="flex-auto rounded-md bg-accent p-4">
        <div className="grid grid-cols-[24px_auto] gap-x-3">
          <Avatar className="relative size-6 flex-none text-xs">
            <AvatarImage
              src={
                item.userCreatedBy?.image ??
                item.customerCreatedBy?.avatarUrl ??
                undefined
              }
            />
            <AvatarFallback>
              {getInitials(
                item.userCreatedBy?.name ?? item.customerCreatedBy?.name ?? ''
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center">
            <span className="text-sm text-foreground">
              {item.userCreatedBy?.name ?? item.customerCreatedBy?.name}
            </span>
            <span className="mx-1.5 size-[3px] rounded-full bg-gray-500"></span>
            <time
              dateTime={item.createdAt.toISOString()}
              className="text-xs text-muted-foreground"
            >
              <RelativeTime dateTime={new Date(item.createdAt)} />
            </time>
          </div>
        </div>

        <div className="grid grid-cols-[24px_auto] gap-x-3">
          <div></div>
          <div className="mt-3 border-t border-muted-foreground pt-3">
            <div className="whitespace-pre-line text-sm leading-6 ">
              {item.entry?.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};