import { signIn } from '@cs/auth';
import { Button } from '@cs/ui/button';

import getIntl from '~/app/i18n/server';

export async function SignIn() {
  const { formatMessage } = await getIntl();
  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Customer Service"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          {formatMessage({ id: 'sign_in_to_your_account' })}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action={async () => {
            'use server';
            await signIn('github', { callbackUrl: '/dashboard' });
          }}
        >
          <Button type="submit" className="w-full">
            {formatMessage({ id: 'sign_in_with_github' })}
          </Button>
        </form>
      </div>
    </>
  );
}
