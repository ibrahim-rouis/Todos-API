import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import {
  CreateUserData,
  LoginUserData,
  RegisterUserData,
  User,
  UserProfile,
} from './auth/auth.schemas.js';

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

declare module 'fastify' {
  export interface FastifyInstance {
    db: {
      users: {
        createUser: (user: CreateUserData) => Promise<void>;
        getUserByEmail: (email: string) => Promise<User | null>;
        getUserById: (id: number) => Promise<User | null>;
      };
    };
    services: {
      auth: {
        registerUser: (user: RegisterUserData) => Promise<void>;
        loginUser: (userReq: LoginUserData) => Promise<UserProfile>;
      };
    };
  }
}

export default IndexRoute;
