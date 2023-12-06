import { FC } from 'react';

import { ChatDirection } from '@cs/lib/chats';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { getInitials } from '~/lib/string';
import { cn } from '~/lib/utils';
import { Contact } from '~/types/Contact';

type MessageAvatarProps = {
  direction: ChatDirection;
  createdBy: Contact;
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
        src={createdBy.avatarUrl ?? undefined}
        alt={createdBy.name ?? ''}
      />
      <AvatarFallback className="text-xs">
        {getInitials(createdBy.name ?? '')}
      </AvatarFallback>
    </Avatar>
  );
};
