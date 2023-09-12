'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';
import { FormattedMessage } from 'react-intl';

import { ActivityPanel } from '~/components/infos/activity-panel';
import { InfoSummary } from '~/components/infos/info-summary';
import { LinkedTicketsPanel } from '~/components/infos/linked-tickets-panel';
import { UserInfoPanel } from '~/components/infos/user-info-panel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { api } from '~/utils/api';

export const InfoPanel: FC = () => {
  const params = useParams();
  const ticketId = parseInt(params.id ?? '');
  const { data: ticketData } = api.ticket.byId.useQuery(
    {
      id: ticketId,
    },
    {
      enabled: !!ticketId,
    }
  );

  if (!ticketData) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l px-4 py-6 sm:px-6 xl:block">
      <div className="flex flex-1 flex-col">
        <InfoSummary ticketId={ticketId} />
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={['item-0', 'item-1', 'item-2']}
        >
          <AccordionItem value="item-0">
            <AccordionTrigger>
              <FormattedMessage id="info_panel.contact_information" />
            </AccordionTrigger>
            <AccordionContent>
              <UserInfoPanel ticketId={ticketId} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <FormattedMessage id="info_panel.conversations" />
            </AccordionTrigger>
            <AccordionContent>
              <LinkedTicketsPanel
                ticketId={ticketId}
                contactId={ticketData?.contactId}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <FormattedMessage id="info_panel.activity" />
            </AccordionTrigger>
            <AccordionContent>
              <ActivityPanel />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
};

InfoPanel.displayName = 'InfoPanel';
