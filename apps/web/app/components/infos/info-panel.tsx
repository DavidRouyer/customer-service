'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@kyaku/ui/accordion';

import { CustomerInfo } from '~/components/infos/customer-info';
import { LinkedTickets } from '~/components/infos/linked-tickets';
import { TicketInfo } from '~/components/infos/ticket-info';

export const InfoPanel = () => {
  return (
    <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l px-4 py-6 sm:px-6 xl:block">
      <header className="flex items-center justify-between border-b pb-6">
        <h1 className="text-base font-semibold leading-10 text-foreground">
          <FormattedMessage id="info_panel.details" />
        </h1>
      </header>
      <div className="flex flex-1 flex-col">
        <Suspense fallback={<Loader2 className="size-8 animate-spin" />}>
          <TicketInfo />
        </Suspense>
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
              <Suspense fallback={<Loader2 className="size-8 animate-spin" />}>
                <CustomerInfo />
              </Suspense>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <FormattedMessage id="info_panel.recent_conversations" />
            </AccordionTrigger>
            <AccordionContent>
              <Suspense fallback={<Loader2 className="size-8 animate-spin" />}>
                <LinkedTickets />
              </Suspense>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
};

InfoPanel.displayName = 'InfoPanel';
