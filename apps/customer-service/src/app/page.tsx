import { redirect } from 'next/navigation';

import { auth } from '@cs/auth';

import { SignIn } from '~/app/_components/sign-in';

export const runtime = 'nodejs';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <SignIn />
    </main>
  );
}
