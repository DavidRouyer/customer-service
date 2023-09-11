import { FC } from 'react';
import { Badge, BadgeAlert, BadgeCheck, CheckCircle2 } from 'lucide-react';

import { MessageStatus as MessageStatusType } from '@cs/database/schema/message';

import { ExtendedMessageStatus, FailedMessageStatus } from '~/types/Message';

export type MessageStatusProps = {
  status: ExtendedMessageStatus;
};

export const MessageStatus: FC<MessageStatusProps> = ({ status }) => {
  if (status === FailedMessageStatus.Failed) return <BadgeAlert size={16} />;
  if (status === MessageStatusType.Pending) return <Badge size={16} />;
  if (status === MessageStatusType.Sent) return <BadgeCheck size={16} />;
  if (status === MessageStatusType.DeliveredToCloud)
    return <BadgeCheck size={16} />;
  if (status === MessageStatusType.DeliveredToDevice)
    return <CheckCircle2 size={16} />;
  if (status === MessageStatusType.Seen) return <CheckCircle2 size={16} />;

  return null;
};

MessageStatus.displayName = 'MessageStatus';
