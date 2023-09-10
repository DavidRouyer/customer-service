import { LayoutWithSidebar } from '~/app/tickets/layout-with-sidebar';
import { InfoPanel } from '~/components/infos/info-panel';
import { TicketList } from '~/components/tickets/ticket-list';

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWithSidebar>
      <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l px-4 py-6 sm:px-6 xl:block">
        <InfoPanel />
      </aside>

      <main className="lg:pl-60">
        <div className="xl:mr-96 xl:h-[100dvh] xl:overflow-y-auto xl:pl-96">
          <div className="flex h-[100dvh] flex-col px-4 py-10 sm:px-6">
            {children}
          </div>
        </div>
      </main>

      <aside className="fixed inset-y-0 left-60 hidden w-96 overflow-y-auto border-r px-4 py-6 sm:px-6 xl:block">
        <TicketList />
      </aside>
    </LayoutWithSidebar>
  );
}
