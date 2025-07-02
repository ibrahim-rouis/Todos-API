import {
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyRequest,
} from 'fastify';
import {
  LoginUserData,
  LoginUserSchema,
  RegisterUserData,
  RegisterUserSchema,
  UserProfile,
  UserProfileSchema,
} from './auth.schemas.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import authServices from './auth.services.js';
import z from 'zod';

const AuthRoutes: FastifyPluginAsync<FastifyPluginOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Plug services
  fastify.register(authServices);

  const { prefix } = opts;

  fastify.get('/', async function (request, reply) {
    return {
      _links: {
        self: { href: `${prefix.toString()}` },
        register: { href: `${prefix.toString()}/register` },
        login: { href: `${prefix.toString()}/login` },
      },
    };
  });

  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/register',
    {
      schema: {
        body: RegisterUserSchema,
        response: {
          200: z.object({
            status: z.string(),
          }),
        },
      },
    },
    async function (
      request: FastifyRequest<{ Body: RegisterUserData }>,
      reply,
    ) {
      await this.authServices.registerUser(request.body);
      return {
        status: 'success',
      };
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    '/login',
    {
      schema: {
        body: LoginUserSchema,
        response: {
          200: z.object({
            status: z.string(),
            data: z.object({
              token: z.string(),
            }),
          }),
        },
      },
    },
    async function (request: FastifyRequest<{ Body: LoginUserData }>, reply) {
      const profile = await this.authServices.loginUser(request.body);
      const token = await reply.jwtSign({
        id: profile.id,
        email: profile.email,
      });
      return {
        status: 'success',
        data: {
          token,
        },
      };
    },
  );

  fastify.get(
    '/profile',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          200: z.object({
            status: z.string(),
            data: UserProfileSchema,
          }),
        },
      },
    },
    async function (request, reply) {
      const user: UserProfile | null = await this.dbUsers.getUserById(
        request.user.id,
      );
      return {
        status: 'success',
        data: user,
      };
    },
  );
};

export default AuthRoutes;
