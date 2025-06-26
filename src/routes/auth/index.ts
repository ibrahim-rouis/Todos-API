import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { RegisterUserData, RegisterUserSchema } from './auth.schemas.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import authServices from './auth.services.js';

const AuthRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Plug services
  fastify.register(authServices);

  fastify.get('/', async function (request, reply) {
    return {
      _links: {
        self: { href: `${this.prefix.toString()}` },
        register: { href: `${this.prefix.toString()}/register` },
        login: { href: `${this.prefix.toString()}/login` },
      },
    };
  });

  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/register',
    {
      schema: {
        body: RegisterUserSchema,
      },
    },
    async function (
      request: FastifyRequest<{ Body: RegisterUserData }>,
      reply,
    ) {
      await this.services.auth.registerUser(request.body);
      return {
        status: 'success',
      };
    },
  );
};

export default AuthRoutes;
