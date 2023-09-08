import { redirect } from 'next/navigation';

import { auth } from '@cs/auth';

import { SignIn } from '~/components/sign-in';

export const runtime = 'nodejs';

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect('/tickets');
  }

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Customer Service"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignIn />
      </div>
    </main>
  );
}
