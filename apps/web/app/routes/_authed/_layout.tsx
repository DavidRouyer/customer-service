import { createFileRoute, Outlet } from '@tanstack/react-router';

import { SidebarNav } from '~/components/sidebar-nav';

export const Route = createFileRoute('/_authed/_layout')({
  component: () => (
    <div>
      <SidebarNav />
      <main className="py-10 lg:pl-60">
        <Outlet />
      </main>
    </div>
  ),
});
