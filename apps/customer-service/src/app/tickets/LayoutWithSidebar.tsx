'use client';

import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlignJustify } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { AgentList } from '~/components/AgentList/AgentList';
import { CurrentUser } from '~/components/CurrentUser/CurrentUser';
import { Logo } from '~/components/Logo';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/Accordion';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar';
import { Sheet, SheetContent } from '~/components/ui/Sheet';
import { useTicket } from '~/hooks/useTicket/TicketProvider';
import { User } from '~/hooks/useTicket/User';

const useNavigationLinks = () => {
  return [
    {
      name: 'Tickets',
      content: (
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <FormattedMessage id="layout.tickets.tickets" />
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-y-1">
                <li>
                  <Link href="/tickets?filter=me">
                    <FormattedMessage id="layout.tickets.my_tickets" />
                  </Link>
                </li>
                <li>
                  <Link href="/tickets?filter=all">
                    <FormattedMessage id="layout.tickets.all_tickets" />
                  </Link>
                </li>
                <li>
                  <Link href="/tickets?filter=unassigned">
                    <FormattedMessage id="layout.tickets.unassigned_tickets" />
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      name: 'Team',
      content: (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <FormattedMessage id="layout.team" />
            </AccordionTrigger>
            <AccordionContent>
              <AgentList />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      name: 'Reports',
      content: (
        <Link
          href="/reports"
          className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
        >
          <FormattedMessage id="layout.reports" />
        </Link>
      ),
    },
    {
      name: 'Settings',
      content: (
        <Link
          href="/settings"
          className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
        >
          <FormattedMessage id="layout.settings" />
        </Link>
      ),
    },
  ];
};

export const LayoutWithSidebar: FC<{
  children: React.ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}> = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}) => {
  const navigation = useNavigationLinks();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { setCurrentUser } = useTicket();
  useEffect(() => {
    if (user)
      setCurrentUser(new User(user.id, user.name, user.email, user.image));
  }, [setCurrentUser, user]);

  return (
    <div>
      <Sheet open={sidebarOpen} onOpenChange={(open) => setSidebarOpen(open)}>
        <SheetContent position="left" size="content">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
            <div className="flex h-16 shrink-0 items-center">
              <Logo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>{item.content}</li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              {navigation.map((item) => (
                <li key={item.name}>{item.content}</li>
              ))}
              <li className="-mx-6 mt-auto">
                <CurrentUser />
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white p-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">
            <FormattedMessage id="layout.open_sidebar" />
          </span>
          <AlignJustify className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          Help Desk
        </div>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
        <a href="#">
          <span className="sr-only">
            <FormattedMessage id="layout.your_profile" />
          </span>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />
            <AvatarFallback>TC</AvatarFallback>
          </Avatar>
        </a>
      </div>

      {children}
    </div>
  );
};

LayoutWithSidebar.displayName = 'LayoutWithSidebar';
