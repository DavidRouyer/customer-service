'use client';

import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Activity } from '~/components/infos/activity';
import { LinkedTickets } from '~/components/infos/linked-tickets';
import { TicketInfo } from '~/components/infos/ticket-info';
import { UserInfo } from '~/components/infos/user-info';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { api } from '~/lib/api';

export const InfoPanel: FC<{
  ticketId: string;
}> = ({ ticketId }) => {
  const [ticketData] = api.ticket.byId.useSuspenseQuery({
    id: ticketId,
  });

  if (!ticketData) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l px-4 py-6 sm:px-6 xl:block">
      <header className="flex items-center justify-between border-b pb-6">
        <h1 className="text-base font-semibold leading-10 text-foreground">
          <FormattedMessage id="info_panel.details" />
        </h1>
      </header>
      <div className="flex flex-1 flex-col">
        <TicketInfo ticketId={ticketId} />
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
              <UserInfo ticketId={ticketId} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <FormattedMessage id="info_panel.recent_conversations" />
            </AccordionTrigger>
            <AccordionContent>
              <LinkedTickets
                ticketId={ticketId}
                customerId={ticketData?.customerId}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <FormattedMessage id="info_panel.activity" />
            </AccordionTrigger>
            <AccordionContent>
              <Activity ticketId={ticketId} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
};

InfoPanel.displayName = 'InfoPanel';
