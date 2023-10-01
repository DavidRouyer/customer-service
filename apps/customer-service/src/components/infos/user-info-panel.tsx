import { FC } from 'react';
import { Mail, Phone } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { Android } from '~/components/icons/android';
import { PhoneNumber } from '~/components/infos/phone-number';
import { Copy } from '~/components/ui/copy';
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
      {ticketData.author.email ? (
        <div className="flex w-full flex-none gap-x-3">
          <dt className="flex flex-none items-center">
            <span className="sr-only">
              <FormattedMessage id="user.email" />
            </span>
            <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </dt>
          <dd className="truncate text-sm leading-6 text-muted-foreground">
            <Copy content={ticketData.author.email}>
              {ticketData.author.email}
            </Copy>
          </dd>
        </div>
      ) : null}
      {ticketData.author.phone ? (
        <div className="mt-4 flex w-full flex-none gap-x-3">
          <dt className="flex flex-none items-center">
            <span className="sr-only">
              <FormattedMessage id="user.phone" />
            </span>
            <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </dt>
          <dd className="truncate text-sm leading-6 text-muted-foreground">
            <Copy content={ticketData.author.phone}>
              <PhoneNumber value={ticketData.author.phone} />
            </Copy>
          </dd>
        </div>
      ) : null}
      <div className="mt-4 flex w-full flex-none gap-x-3">
        <dt className="flex flex-none items-center">
          <span className="sr-only">
            <FormattedMessage id="user.platform" />
          </span>
          <Android className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </dt>
        <dd className="truncate text-sm leading-6 text-muted-foreground">
          <Copy content={user.app.version}>{user.app.version}</Copy>
        </dd>
      </div>
    </dl>
  );
};
