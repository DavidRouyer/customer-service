import { redirect } from 'next/navigation';

import { SidebarNav } from '~/components/sidebar-nav';
import { getCurrentUser } from '~/lib/session';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return redirect('/');
  }

  return (
    <div>
      <SidebarNav />
      {children}
    </div>
  );
}
