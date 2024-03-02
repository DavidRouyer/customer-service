import { FC } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Copy } from '@cs/ui/copy';

import { PhoneNumber } from '~/components/infos/phone-number';
import { api } from '~/lib/api';

const user = {
  app: {
    platform: 'android',
    version: '1.0.0',
  },
};

export const CustomerInfo: FC<{ ticketId: string }> = ({ ticketId }) => {
  const { formatMessage } = useIntl();
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
          <Copy
            content={ticketData.customer.name}
            translations={{
              copy: formatMessage({ id: 'clipboard.copy' }),
              copied: formatMessage({ id: 'clipboard.copied' }),
            }}
          >
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
          <Copy
            content={ticketData.customer.email}
            translations={{
              copy: formatMessage({ id: 'clipboard.copy' }),
              copied: formatMessage({ id: 'clipboard.copied' }),
            }}
          >
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
          <Copy
            content={ticketData.customer.phone}
            translations={{
              copy: formatMessage({ id: 'clipboard.copy' }),
              copied: formatMessage({ id: 'clipboard.copied' }),
            }}
          >
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
        <Copy
          content={user.app.version}
          translations={{
            copy: formatMessage({ id: 'clipboard.copy' }),
            copied: formatMessage({ id: 'clipboard.copied' }),
          }}
        >
          {user.app.version}
        </Copy>
      </dd>
    </dl>
  );
};
