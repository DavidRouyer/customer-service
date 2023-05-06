import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { MessageList } from '@/components/MessageList/MessageList';

export async function loader() {
  return true;
}

export const Component: FC = () => {
  const { id } = useParams();
  return (
    <div>
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          John Doe
        </h3>
      </div>

      <MessageList />
    </div>
  );
};

Component.displayName = 'Ticket';
