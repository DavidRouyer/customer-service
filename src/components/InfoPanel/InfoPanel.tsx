import { FC } from 'react';
import { Trans } from 'react-i18next';

import { DisplayLanguageName } from '@/components/DisplayLanguageName/DisplayLanguageName';
import { Android } from '@/components/Icons/Android';
import { ActivityPanel } from '@/components/InfoPanel/ActivityPanel';
import { UserTicketsPanel } from '@/components/InfoPanel/UserTicketsPanel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion';
import { Mail, Phone } from 'lucide-react';

const user = {
  id: 1,
  name: 'Leslie Alexander',
  imageUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  email: 'leslie.alexander@gmail.com',
  phone: '+33 6 06 06 06 06',
  language: 'fr_FR',
  timezone: 'Europe/Paris',
  app: {
    platform: 'android',
    version: '1.0.0',
  },
};

export const InfoPanel: FC = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div>
        <div className="flex space-x-3 border-b border-gray-900/5 pb-6">
          <div className="shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src={user.imageUrl}
              alt=""
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">
              <a href="#" className="hover:underline">
                {user.name}
              </a>
            </p>
            <p className="flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p>
                <DisplayLanguageName language={user.language.substring(0, 2)} />
              </p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p>20:50 (GMT+2)</p>
            </p>
          </div>
        </div>
      </div>
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={['item-0', 'item-1', 'item-2']}
      >
        <AccordionItem value="item-0">
          <AccordionTrigger>
            <Trans i18nKey="info_panel.contact_information" />
          </AccordionTrigger>
          <AccordionContent>
            <dl>
              <div className="flex w-full flex-none gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">
                    <Trans i18nKey="user.email" />
                  </span>
                  <Mail className="h-6 w-5 text-gray-400" aria-hidden="true" />
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  {user.email}
                </dd>
              </div>
              <div className="mt-4 flex w-full flex-none gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">
                    <Trans i18nKey="user.phone" />
                  </span>
                  <Phone className="h-6 w-5 text-gray-400" aria-hidden="true" />
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  <time dateTime="2023-01-31">{user.phone}</time>
                </dd>
              </div>
              <div className="mt-4 flex w-full flex-none gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">
                    <Trans i18nKey="user.platform" />
                  </span>
                  <Android
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-500">
                  {user.app.version}
                </dd>
              </div>
            </dl>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Trans i18nKey="info_panel.conversations" />
          </AccordionTrigger>
          <AccordionContent>
            <UserTicketsPanel />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <Trans i18nKey="info_panel.activity" />
          </AccordionTrigger>
          <AccordionContent>
            <ActivityPanel />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

InfoPanel.displayName = 'InfoPanel';
