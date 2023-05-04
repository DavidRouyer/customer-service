import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const LayoutWithTicketList: FC = () => {
  return (
    <>
      <main className="lg:pl-72">
        <div className="xl:pl-96">
          <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            <Outlet />
          </div>
        </div>
      </main>

      <aside className="fixed inset-y-0 left-72 hidden w-96 overflow-y-auto border-r border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
        {/* Secondary column (hidden on smaller screens) */}
      </aside>
    </>
  );
};

LayoutWithTicketList.displayName = 'LayoutWithTicketList';
