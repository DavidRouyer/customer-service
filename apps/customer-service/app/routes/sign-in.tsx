import { createFileRoute } from '@tanstack/react-router';
import { useIntl } from 'react-intl';

import { Button } from '@cs/ui/button';

import { signIn } from '~/utils/sign-in';

export const Route = createFileRoute('/sign-in')({
  component: () => {
    const { formatMessage } = useIntl();

    return (
      <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
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
          <Button
            type="button"
            className="w-full"
            onClick={() =>
              signIn({
                redirectUrl: window.location.origin,
              })
            }
          >
            {formatMessage({ id: 'sign_in_with_github' })}
          </Button>
        </div>
      </main>
    );
  },
});
