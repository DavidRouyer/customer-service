import { redirect } from 'next/navigation';

import { auth } from '@cs/auth';

import { SignIn, SignOut } from '~/components/auth';

export async function AuthShowcase() {
  const session = await auth();

  if (session) {
    redirect('/tickets');
    /*return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session.user.name}</span>}
        </p>

        <SignOut className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
          Sign out
        </SignOut>
      </div>
    );*/
  }

  return (
    <SignIn
      provider="github"
      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Sign in with GitHub
    </SignIn>
  );
}
