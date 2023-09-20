'use client';

import { FC, Suspense, useState } from 'react';
import Link from 'next/link';
import { AlignJustify, BarChart3, BookmarkX, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

import { Logo } from '~/components/logo';
import { TeamMemberList } from '~/components/team-members/team-members-list';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Sheet, SheetContent } from '~/components/ui/sheet';
import { UserNav } from '~/components/user-nav';
import { api } from '~/utils/api';
import { FILTER_QUERY_PARAM } from '~/utils/search-params';
import { getInitials } from '~/utils/string';

export const LayoutWithSidebar: FC<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: statsData } = api.ticket.stats.useQuery();

  const navigationLinks = [
    {
      name: 'Tickets',
      content: (
        <ul className="-mx-2 flex flex-col gap-y-1">
          <li>
            <Link
              href={`/tickets?${FILTER_QUERY_PARAM}=me`}
              className="flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <div className="flex items-center gap-x-3">
                <Avatar className="h-4 w-4 shrink-0">
                  <AvatarImage src={session.data?.user.image ?? undefined} />
                  <AvatarFallback>
                    {getInitials(session.data?.user.name ?? '')}
                  </AvatarFallback>
                </Avatar>
                <FormattedMessage id="layout.tickets.my_tickets" />
              </div>

              {statsData?.assignedToMe}
            </Link>
          </li>
          <li>
            <Link
              href={`/tickets?${FILTER_QUERY_PARAM}=all`}
              className="flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <div className="flex items-center gap-x-3">
                <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
                <FormattedMessage id="layout.tickets.all_tickets" />
              </div>

              {statsData?.total}
            </Link>
          </li>
          <li>
            <Link
              href={`/tickets?${FILTER_QUERY_PARAM}=unassigned`}
              className="flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <div className="flex items-center gap-x-3">
                <BookmarkX className="h-4 w-4 shrink-0" aria-hidden="true" />
                <FormattedMessage id="layout.tickets.unassigned_tickets" />
              </div>

              {statsData?.unassigned}
            </Link>
          </li>
          <li>
            <Link
              href="/reports"
              className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <BarChart3 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <FormattedMessage id="layout.reports" />
            </Link>
          </li>
        </ul>
      ),
    },
    {
      name: 'Team',
      content: (
        <div className="text-xs font-semibold leading-6 text-gray-400">
          <FormattedMessage id="layout.team" />
          <ul className="-mx-2 flex flex-col gap-y-1">
            <Suspense fallback={null}>
              <TeamMemberList />
            </Suspense>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Sheet open={sidebarOpen} onOpenChange={(open) => setSidebarOpen(open)}>
        <SheetContent position="left" size="content">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-2">
            <div className="flex h-16 shrink-0 items-center">
              <Logo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul className="-mx-2 space-y-1">
                    {navigationLinks.map((item) => (
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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              {navigationLinks.map((item) => (
                <li key={item.name}>{item.content}</li>
              ))}
              <li className="-mx-6 mt-auto">
                <UserNav showLabel />
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-background p-4 shadow-sm sm:px-6 lg:hidden">
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
        <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
          Help Desk
        </div>
        <UserNav />
      </div>

      {children}
    </div>
  );
};

LayoutWithSidebar.displayName = 'LayoutWithSidebar';
