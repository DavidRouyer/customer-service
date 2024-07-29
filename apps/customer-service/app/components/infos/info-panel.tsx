'use client';

import type { FC } from 'react';
import { useTicketQuery } from 'graphql/generated/client';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@cs/ui/accordion';

import { CustomerInfo } from '~/app/_components/infos/customer-info';
import { LinkedTickets } from '~/app/_components/infos/linked-tickets';
import { TicketInfo } from '~/app/_components/infos/ticket-info';

export const InfoPanel: FC<{
  ticketId: string;
}> = ({ ticketId }) => {
  const { data: ticketData } = useTicketQuery(
    {
      ticketId: ticketId,
    },
    {
      select: (data) => data.ticket,
    }
  );

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
          defaultValue={['item-0', 'item-1']}
        >
          <AccordionItem value="item-0">
            <AccordionTrigger>
              <FormattedMessage id="info_panel.contact_information" />
            </AccordionTrigger>
            <AccordionContent>
              <CustomerInfo ticketId={ticketId} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <FormattedMessage id="info_panel.recent_conversations" />
            </AccordionTrigger>
            <AccordionContent>
              <LinkedTickets
                ticketId={ticketId}
                customerId={ticketData.customer.id}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
};

InfoPanel.displayName = 'InfoPanel';
