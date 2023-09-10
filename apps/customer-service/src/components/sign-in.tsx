'use client';

import { signIn } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

import { Button } from '~/components/ui/button';

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
        <Button
          onClick={() => signIn('github', { callbackUrl: '/tickets' })}
          className="w-full"
        >
          <FormattedMessage id="sign_in_with_github" />
        </Button>
      </div>
    </>
  );
}
