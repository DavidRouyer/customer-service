import type { AnyRouter } from '@tanstack/react-router';
import type { EventHandler } from 'vinxi/http';

import { authOptions } from '@kyaku/auth';

import { authenticateRequest } from './authenticateRequest';

export type HandlerCallback<TRouter extends AnyRouter> = (ctx: {
  request: Request;
  router: TRouter;
  responseHeaders: Headers;
}) => Response | Promise<Response>;
export type CustomizeRequestHandler<TRouter extends AnyRouter> = (
  cb: HandlerCallback<TRouter>,
) => EventHandler;

export function createAuthjsHandler<TRouter extends AnyRouter>(
  eventHandler: CustomizeRequestHandler<TRouter>,
) {
  return (cb: HandlerCallback<TRouter>): EventHandler => {
    return eventHandler(async ({ request, router, responseHeaders }) => {
      try {
        const requestState = await authenticateRequest(request, authOptions);

        // Updating the TanStack router context with the Auth.js context and loading the router
        router.update({
          context: {
            ...router.options.context,
            session: requestState,
          },
        });

        await router.load();
      } catch (error) {
        if (error instanceof Response) {
          // returning the response
          return error;
        }

        // rethrowing the error if it is not a Response
        throw error;
      }

      return cb({ request, router, responseHeaders });
    });
  };
}
