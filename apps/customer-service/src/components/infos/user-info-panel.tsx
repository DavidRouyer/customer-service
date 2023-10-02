import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

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
    <dl className="grid grid-cols-[5rem,_1fr] items-center gap-x-3 gap-y-4">
      <dt className="flex flex-none items-center">
        <FormattedMessage id="info_panel.user_panel.name" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        {ticketData.author.name ? (
          <Copy content={ticketData.author.name}>{ticketData.author.name}</Copy>
        ) : (
          <span>
            <FormattedMessage id="not_documented" />
          </span>
        )}
      </dd>

      <dt className="flex flex-none items-center">
        <FormattedMessage id="info_panel.user_panel.email" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        {ticketData.author.email ? (
          <Copy content={ticketData.author.email}>
            {ticketData.author.email}
          </Copy>
        ) : (
          <span>
            <FormattedMessage id="not_documented" />
          </span>
        )}
      </dd>

      <dt className="flex flex-none items-center">
        <FormattedMessage id="info_panel.user_panel.phone_number" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        {ticketData.author.phone ? (
          <Copy content={ticketData.author.phone}>
            <PhoneNumber value={ticketData.author.phone} />
          </Copy>
        ) : (
          <span>
            <FormattedMessage id="not_documented" />
          </span>
        )}
      </dd>

      <dt className="flex flex-none items-center">
        <FormattedMessage id="user.platform" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        <Copy content={user.app.version}>{user.app.version}</Copy>
      </dd>
    </dl>
  );
};
