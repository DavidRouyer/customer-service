import { ApolloServer, BaseContext } from '@apollo/server';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import Fastify from 'fastify';

import { ticketsMock } from './ticketsMock';

const fastify = Fastify({});

const typeDefs = `
  type User {
    name: String!
    imageUrl: String
  }

  type Ticket {
    id: ID!
    user: User!
    content: String!
    openingDate: String!
  }

  type Query {
    allTickets: [Ticket!]!
  }
`;

const resolvers = {
  Query: {
    allTickets: () => ticketsMock,
  },
};

const apollo = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)],
});

await apollo.start();

await fastify.register(fastifyApollo(apollo));

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '') || 8080;
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
