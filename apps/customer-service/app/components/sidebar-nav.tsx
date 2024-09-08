import type { FC } from 'react';
import { Suspense, useState } from 'react';
import { AlignJustify } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { Sheet, SheetContent } from '@cs/ui/sheet';

import { DashboardCommandMenu } from '~/components/dashboard-command-menu';
import { Logo } from '~/components/logo';
import { InboxList } from '~/components/navbar/inbox-list';
import { TeamMemberList } from '~/components/navbar/team-member-list';
import { UserNav } from '~/components/user-nav';

export const SidebarNav: FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationLinks = [
    {
      name: 'Default',
      content: (
        <ul className="-mx-2 flex flex-col gap-y-1">
          <Suspense fallback={null}>
            <InboxList />
          </Suspense>
        </ul>
      ),
    },
    {
      name: 'Team',
      content: (
        <div className="text-xs font-semibold leading-6 text-gray-400">
          <FormattedMessage id="layout.team" />
          <ul className="-mx-2 mt-2 flex flex-col gap-y-1">
            <Suspense fallback={null}>
              <TeamMemberList />
            </Suspense>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardCommandMenu />
      <Sheet open={sidebarOpen} onOpenChange={(open) => setSidebarOpen(open)}>
        <SheetContent side="left" className="max-w-min">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-2">
            <div className="flex h-16 shrink-0 items-center">
              <Logo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul className="flex flex-1 flex-col gap-y-7">
                {navigationLinks.map((item) => (
                  <li key={item.name}>{item.content}</li>
                ))}
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
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
                <Suspense>
                  <UserNav showLabel />
                </Suspense>
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
          <AlignJustify className="size-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-foreground">
          Help Desk
        </div>
        <Suspense>
          <UserNav />
        </Suspense>
      </div>
    </>
  );
};

SidebarNav.displayName = 'SidebarNav';
