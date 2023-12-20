'use client';

import { TRPCClientError } from '@trpc/client';
import { XIcon } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@cs/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const getError = (error: Error) => {
    if (error instanceof TRPCClientError) {
      if (error.message === 'ticket_not_found') {
        return <FormattedMessage id="errors.ticket_not_found" />;
      }
    }

    return <FormattedMessage id="errors.unhandled_error" />;
  };

  return (
    <main className="lg:pl-60">
      <div className="flex items-center justify-center xl:mr-96 xl:h-[100dvh] xl:overflow-y-auto xl:pl-96">
        <div className="sm:w-full sm:max-w-sm">
          <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive-foreground">
              <XIcon className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-base font-semibold leading-6 text-foreground">
                <FormattedMessage id="error.an_error_occured" />
              </h3>
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  {getError(error)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <Button type="button" className="w-full" onClick={() => reset()}>
              <FormattedMessage id="try_again" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
