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

  fastify.decorate('authServices', {
    registerUser: async function (user: RegisterUserData) {
      const password_hash = await hashPassword(user.password);
      await fastify.dbUsers.createUser({
        username: user.username,
        email: user.email,
        password_hash,
      });
    },
    loginUser: async function (userReq: LoginUserData): Promise<UserProfile> {
      const user = await fastify.dbUsers.getUserByEmail(userReq.email);
      if (!user) {
        throw Error('Email not found');
      }
      if (await verifyPassword(userReq.password, user.password_hash)) {
        return user;
      } else {
        throw Error('Incorrect password');
      }
    },
  });
});
