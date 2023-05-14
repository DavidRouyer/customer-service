import { ApolloServer, BaseContext } from '@apollo/server';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';

const fastify = Fastify({});

const prisma = new PrismaClient();

const typeDefs = `
  scalar Date

  type User {
    id: ID!
    name: String!
    imageUrl: String
  }

  type Ticket {
    id: ID!
    user: User!
    content: String!
    createdAt: Date!
  }

  type Query {
    allTickets: [Ticket!]!
  }
`;

const resolvers = {
  Query: {
    allTickets: async () =>
      await prisma.ticket.findMany({ include: { user: true } }),
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
