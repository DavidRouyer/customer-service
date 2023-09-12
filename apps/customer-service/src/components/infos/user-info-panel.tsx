import { FC } from 'react';
import { Mail, Phone } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { Android } from '~/components/icons/android';
import { api } from '~/utils/api';

const user = {
  app: {
    platform: 'android',
    version: '1.0.0',
  },
};

export const UserInfoPanel: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({
    id: ticketId,
  });

  if (!ticketData) {
    return null;
  }

  return (
    <dl>
      <div className="flex w-full flex-none gap-x-4">
        <dt className="flex-none">
          <span className="sr-only">
            <FormattedMessage id="user.email" />
          </span>
          <Mail className="h-6 w-5 text-gray-400" aria-hidden="true" />
        </dt>
        <dd className="text-sm leading-6 text-muted-foreground">
          {ticketData.author.email}
        </dd>
      </div>
      <div className="mt-4 flex w-full flex-none gap-x-4">
        <dt className="flex-none">
          <span className="sr-only">
            <FormattedMessage id="user.phone" />
          </span>
          <Phone className="h-6 w-5 text-gray-400" aria-hidden="true" />
        </dt>
        <dd className="text-sm leading-6 text-muted-foreground">
          {ticketData.author.phone}
        </dd>
      </div>
      <div className="mt-4 flex w-full flex-none gap-x-4">
        <dt className="flex-none">
          <span className="sr-only">
            <FormattedMessage id="user.platform" />
          </span>
          <Android className="h-6 w-5 text-gray-400" aria-hidden="true" />
        </dt>
        <dd className="text-sm leading-6 text-muted-foreground">
          {user.app.version}
        </dd>
      </div>
    </dl>
  );
};
