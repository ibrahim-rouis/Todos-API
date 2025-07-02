import fp from 'fastify-plugin';
import fastifyjwt, { FastifyJwtSignOptions } from '@fastify/jwt';
import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * This plugins adds JWT authentication utilities
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifyJwtSignOptions>(async (fastify, opts) => {
  fastify.register(fastifyjwt, { secret: String(process.env.JWT_SECRET) });
  fastify.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  );
});

// Specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

// Specify user
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: number; email: string };
    user: { id: number; email: string };
  }
}
