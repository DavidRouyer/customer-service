import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { AwilixContainer } from 'awilix';
import { createApplication } from 'graphql-modules';

import { commonModule } from './modules/common/resolvers';
import { labelTypeModule } from './modules/label-type/resolvers';
import { userModule } from './modules/user/resolvers';
import type { AppRouter } from './root';
import { appRouter } from './root';
import { createCallerFactory, createTRPCContext } from './trpc';

/**
 * Create a server-side caller for the tRPC API
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
const createCaller = createCallerFactory(appRouter);

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { createTRPCContext, appRouter, createCaller };
export type { AppRouter, RouterInputs, RouterOutputs };

const application = createApplication({
  modules: [commonModule, labelTypeModule, userModule],
});
export { application };
export { container } from './trpc';

declare global {
  namespace GraphQLModules {
    interface GlobalContext {
      container: AwilixContainer;
    }
  }
}
