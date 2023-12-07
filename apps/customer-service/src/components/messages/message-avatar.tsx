import { FC } from 'react';

import { ChatDirection } from '@cs/lib/chats';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { RouterOutputs } from '~/lib/api';
import { getInitials } from '~/lib/string';
import { cn } from '~/lib/utils';

type MessageAvatarProps = {
  direction: ChatDirection;
  createdBy: RouterOutputs['ticket']['byId']['createdBy'];
};

export const MessageAvatar: FC<MessageAvatarProps> = ({
  direction,
  createdBy,
}) => {
  return (
    <Avatar
      className={cn(
        'h-6 w-6 rounded-full',
        direction === ChatDirection.Outbound ? 'order-2' : 'order-1'
      )}
    >
      <AvatarImage
        src={createdBy.image ?? undefined}
        alt={createdBy.name ?? ''}
      />
      <AvatarFallback className="text-xs">
        {getInitials(createdBy.name ?? '')}
      </AvatarFallback>
    </Avatar>
  );
};
