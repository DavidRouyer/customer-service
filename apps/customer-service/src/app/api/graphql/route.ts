// Next.js Custom Route Handler: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
import { useGraphQLModules } from '@envelop/graphql-modules';
import { createYoga } from 'graphql-yoga';

import { application, container } from '@cs/api';

export const runtime = 'nodejs';

const { handleRequest } = createYoga({
  plugins: [useGraphQLModules(application)],
  context: () => ({
    container,
  }),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: '/api/graphql',

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
