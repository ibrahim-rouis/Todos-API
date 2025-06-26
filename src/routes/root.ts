import { FastifyPluginAsync } from 'fastify';

const IndexRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    return {
      _links: {
        self: { href: `${this.prefix.toString()}` },
        auth: {
          href: `${this.prefix.toString()}/auth`,
          description: 'Authentication API',
        },
      },
      version: '1.0.0',
      status: 'OK',
    };
  });
};

export default IndexRoute;
