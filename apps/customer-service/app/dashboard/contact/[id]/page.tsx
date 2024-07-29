import { notFound } from 'next/navigation';

interface DashboardContactPageProps {
  params: {
    id: string;
  };
}

export default function DashboardContactPage({
  params: { id },
}: DashboardContactPageProps) {
  if (!id) return notFound();

  return (
    <main className="py-10 lg:pl-60">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">{id}</h2>
      </div>
    </main>
  );
}

DashboardContactPage.displayName = 'DashboardContactPage';
