import { LayoutWithSidebar } from '~/app/tickets/layout-with-sidebar';
import { InfoPanel } from '~/components/infos/info-panel';
import { TicketList } from '~/components/tickets/ticket-list';
import { TicketListHeader } from '~/components/tickets/ticket-list-header';

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <LayoutWithSidebar>
      <InfoPanel />

      <main className="lg:pl-60">
        <div className="xl:mr-96 xl:h-[100dvh] xl:overflow-y-auto xl:pl-96">
          <div className="flex h-[100dvh] flex-col px-4 py-10 sm:px-6">
            {children}
          </div>
        </div>
      </main>

      <aside className="fixed inset-y-0 left-60 hidden w-96 flex-col border-r xl:flex">
        <TicketListHeader />
        <TicketList />
      </aside>
    </LayoutWithSidebar>
  );
}
