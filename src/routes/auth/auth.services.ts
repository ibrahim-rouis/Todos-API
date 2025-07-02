import fp from 'fastify-plugin';
import {
  LoginUserData,
  RegisterUserData,
  UserProfile,
} from './auth.schemas.js';
import { hashPassword, verifyPassword } from '../../utils/password-utils.js';
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
      loginUser: async function (userReq: LoginUserData): Promise<UserProfile> {
        const user = await fastify.db.users.getUserByEmail(userReq.email);
        if (!user) {
          throw Error('Email not found');
        }
        if (await verifyPassword(userReq.password, user.password_hash)) {
          return user;
        } else {
          throw Error('Incorrect password');
        }
      },
    },
  });
});

declare module 'fastify' {
  export interface FastifyInstance {
    services: {
      auth: {
        registerUser: (user: RegisterUserData) => Promise<void>;
        loginUser: (userReq: LoginUserData) => Promise<UserProfile>;
      };
    };
  }
}
