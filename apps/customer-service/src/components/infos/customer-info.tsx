import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { PhoneNumber } from '~/components/infos/phone-number';
import { Copy } from '~/components/ui/copy';
import { api } from '~/lib/api';

const user = {
  app: {
    platform: 'android',
    version: '1.0.0',
  },
};

export const CustomerInfo: FC<{ ticketId: string }> = ({ ticketId }) => {
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
        {ticketData.customer.name ? (
          <Copy content={ticketData.customer.name}>
            {ticketData.customer.name}
          </Copy>
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
        {ticketData.customer.email ? (
          <Copy content={ticketData.customer.email}>
            {ticketData.customer.email}
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
        {ticketData.customer.phone ? (
          <Copy content={ticketData.customer.phone}>
            <PhoneNumber value={ticketData.customer.phone} />
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
