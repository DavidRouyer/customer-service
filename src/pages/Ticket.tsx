import { FC } from 'react';
import { Trans } from 'react-i18next';
import { useParams } from 'react-router-dom';

export async function loader() {
  return true;
}

export const Component: FC = () => {
  const { id } = useParams();
  return (
    <div>
      <Trans i18nKey="ticket.ticket_for_name" values={{ name: id }} />
    </div>
  );
};

Component.displayName = 'Ticket';
