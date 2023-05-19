import { FC } from 'react';

import { MessageList } from '@/components/MessageList/MessageList';
import { useConversation } from '@/hooks/useConversation/ConversationProvider';

export const Component: FC = () => {
  const { activeConversation } = useConversation();

  if (!activeConversation) return null;

  return (
    <div>
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          <span className="text-gray-500">#{activeConversation.id}</span>{' '}
          {activeConversation.contact.name}
        </h3>
      </div>

      <MessageList />
    </div>
  );
};

Component.displayName = 'Ticket';
