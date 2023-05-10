import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';

const server: FastifyInstance = Fastify({});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string',
          },
        },
      },
    },
  },
};

server.get('/ping', opts, async (request, reply) => {
  return { pong: 'it worked!' };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT as string) || 8080;
    await server.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
