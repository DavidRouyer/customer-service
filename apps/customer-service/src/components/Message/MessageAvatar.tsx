import { FC } from 'react';

import { MessageDirection } from '@cs/database/schema/message';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar';
import { Contact } from '~/hooks/useTicket/Contact';
import { getInitials } from '~/utils/string';
import { cn } from '~/utils/utils';

type MessageAvatarProps = {
  direction: MessageDirection;
  sender: Contact;
};

export const MessageAvatar: FC<MessageAvatarProps> = ({
  direction,
  sender,
}) => {
  return (
    <Avatar
      className={cn(
        'h-6 w-6 rounded-full',
        direction === MessageDirection.Outbound ? 'order-2' : 'order-1'
      )}
    >
      <AvatarImage
        src={sender.avatarUrl ?? undefined}
        alt={sender.name ?? ''}
      />
      <AvatarFallback className="text-xs">
        {getInitials(sender.name ?? '')}
      </AvatarFallback>
    </Avatar>
  );
};
