import { FC } from 'react';

import { MessageDirection } from '@cs/lib/messages';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { getInitials } from '~/lib/string';
import { cn } from '~/lib/utils';
import { Contact } from '~/types/Contact';

type MessageAvatarProps = {
  direction: MessageDirection;
  author: Contact;
};

export const MessageAvatar: FC<MessageAvatarProps> = ({
  direction,
  author,
}) => {
  return (
    <Avatar
      className={cn(
        'h-6 w-6 rounded-full',
        direction === MessageDirection.Outbound ? 'order-2' : 'order-1'
      )}
    >
      <AvatarImage
        src={author.avatarUrl ?? undefined}
        alt={author.name ?? ''}
      />
      <AvatarFallback className="text-xs">
        {getInitials(author.name ?? '')}
      </AvatarFallback>
    </Avatar>
  );
};
