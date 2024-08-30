import { createYoga } from 'graphql-yoga';
import { fromNodeMiddleware } from 'vinxi/http';

import { getContext, schema } from '@cs/api/graphql';

const yoga = createYoga({
  schema: schema,
  context: getContext,

  // Disable GraphiQL
  graphiql: false,
});

export default fromNodeMiddleware(yoga);
