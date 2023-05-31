import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
  Resolvers,
} from '@/gql/resolvers-types';
import { ApolloServer, BaseContext } from '@apollo/server';
import fastifyApollo, {
  fastifyApolloDrainPlugin,
} from '@as-integrations/fastify';
import compress from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import Fastify from 'fastify';
import { readFileSync } from 'node:fs';

dotenv.config();

const fastify = Fastify({});

const prisma = new PrismaClient();

const typeDefs = readFileSync('./src/schema.graphql', 'utf8');

const resolvers: Resolvers = {
  Query: {
    allTickets: async () => {
      const tickets = await prisma.ticket.findMany({
        include: { contact: true },
      });
      return tickets.map((ticket) => ({
        ...ticket,
        id: ticket.id.toString(),
        contact: { ...ticket.contact, id: ticket.contact.id.toString() },
      }));
    },
    allMessages: async (_, { ticketId }) => {
      const sanitizedTicketId = typeof ticketId === 'number' ? ticketId : parseInt(ticketId);
      const messages = await prisma.message.findMany({
        where: { ticketId: sanitizedTicketId },
        include: { sender: true },
      });
      return messages.map((message) => ({
        ...message,
        id: message.id.toString(),
        contentType: <MessageContentType>message.contentType,
        direction: <MessageDirection>message.direction,
        status: <MessageStatus>message.status,
        sender: { ...message.sender, id: message.sender.id.toString() },
      }));
    },
  },
  Mutation: {
    addMessage: async (_, { ticketId, message }) => {
      const sanitizedTicketId = typeof ticketId === 'number' ? ticketId : parseInt(ticketId);
      const sanitizedSenderId = typeof message.senderId === 'number' ? message.senderId : parseInt(message.senderId);
      await prisma.message.create({
        data: {
          ...message,
          ticketId: sanitizedTicketId,
          senderId: sanitizedSenderId,
        }
      });
      return '';
    }
  }
};

const apollo = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)],
});

await apollo.start();

await fastify.register(rateLimit);
await fastify.register(helmet, {
  global: process.env.NODE_ENV === 'production' ? true : false,
});
await fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : '*',
});
await fastify.register(compress);

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
