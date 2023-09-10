'use client';

import { signIn } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

export function SignIn() {
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Customer Service"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          <FormattedMessage id="sign_in_to_your_account" />
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <button
          onClick={() => signIn('github')}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <FormattedMessage id="sign_in_with_github" />
        </button>
      </div>
    </>
  );
}
