import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';

const IndexRoute: FastifyPluginAsync<FastifyPluginOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  const { prefix } = opts;

  fastify.get('/', async function (request, reply) {
    return {
      _links: {
        self: { href: `${prefix.toString()}` },
        auth: {
          href: `${prefix.toString()}/auth`,
          description: 'Authentication API',
        },
      },
      version: '1.0.0',
      status: 'OK',
    };
  });
};

export default IndexRoute;
