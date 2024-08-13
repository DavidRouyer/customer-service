import { createYoga } from 'graphql-yoga';
import { defineEventHandler } from 'vinxi/http';

import { getContext, schema } from '@cs/api/graphql';

const yoga = createYoga({
  schema: schema,
  context: getContext,

  // Disable GraphiQL
  graphiql: false,
});

export default defineEventHandler((event) => {
  const { req, res } = event.node;

  return yoga(req, res);
});
