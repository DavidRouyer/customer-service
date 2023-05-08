import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { InfoPanel } from '@/components/InfoPanel/InfoPanel';
import { TicketList } from '@/components/TicketList/TicketList';

export const LayoutWithTicketList: FC = () => {
  return (
    <>
      <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 2xl:block">
        <InfoPanel />
      </aside>

      <main className="lg:pl-72">
        <div className="xl:pl-96 2xl:pr-96">
          <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            <Outlet />
          </div>
        </div>
      </main>

      <aside className="fixed inset-y-0 left-72 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
        <TicketList />
      </aside>
    </>
  );
};

LayoutWithTicketList.displayName = 'LayoutWithTicketList';
