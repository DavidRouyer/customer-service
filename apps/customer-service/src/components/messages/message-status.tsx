import { FC } from 'react';
import { Badge, BadgeAlert, BadgeCheck, CheckCircle2 } from 'lucide-react';

import { ChatStatus } from '@cs/lib/chats';

import { ExtendedMessageStatus, FailedMessageStatus } from '~/types/Message';

export type MessageStatusProps = {
  status: ExtendedMessageStatus;
};

export const MessageStatus: FC<MessageStatusProps> = ({ status }) => {
  if (status === FailedMessageStatus.Failed) return <BadgeAlert size={16} />;
  if (status === ChatStatus.Pending) return <Badge size={16} />;
  if (status === ChatStatus.Sent) return <BadgeCheck size={16} />;
  if (status === ChatStatus.DeliveredToCloud) return <BadgeCheck size={16} />;
  if (status === ChatStatus.DeliveredToDevice)
    return <CheckCircle2 size={16} />;
  if (status === ChatStatus.Seen) return <CheckCircle2 size={16} />;

  return null;
};

MessageStatus.displayName = 'MessageStatus';
