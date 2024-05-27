import { redirect } from 'next/navigation';

import { SidebarNav } from '~/app/_components/sidebar-nav';
import { getCurrentUser } from '~/app/lib/session';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

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
