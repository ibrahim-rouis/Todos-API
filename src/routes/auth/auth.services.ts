import fp from 'fastify-plugin';
import { RegisterUserData } from './auth.schemas.js';
import { hashPassword } from '../../utils/password-utils.js';
import authDb from './auth.db.js';

export default fp(async (fastify, opts) => {
  fastify.register(authDb);

  fastify.decorate('services', {
    auth: {
      registerUser: async function (user: RegisterUserData) {
        const password_hash = await hashPassword(user.password);
        await fastify.db.users.createUser({
          username: user.username,
          email: user.email,
          password_hash,
        });
      },
    },
  });
});

declare module 'fastify' {
  export interface FastifyInstance {
    services: {
      auth: {
        registerUser: (user: RegisterUserData) => Promise<void>;
      };
    };
  }
}
