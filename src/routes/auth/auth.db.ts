import fp from 'fastify-plugin';
import { CreateUserData, User } from './auth.schemas.js';

export default fp(async (fastify, opts) => {
  fastify.decorate('db', {
    users: {
      createUser: async function (user: CreateUserData): Promise<void> {
        await fastify.db_connection_wrapper(async (client) => {
          await client.query(
            'insert into users(username,email,password_hash) values($1,$2,$3)',
            [user.username, user.email, user.password_hash],
          );
        });
      },
      getUserByEmail: async function (email: string): Promise<User | null> {
        return await fastify.db_connection_wrapper(async (client) => {
          const users = await client.query(
            'select id, username, email, password_hash from users where email = $1',
            [email],
          );

          if (!users) {
            return null;
          }

          return users[0];
        });
      },
    },
  });
});

declare module 'fastify' {
  export interface FastifyInstance {
    db: {
      users: {
        createUser: (user: CreateUserData) => Promise<void>;
        getUserByEmail: (email: string) => Promise<User | null>;
      };
    };
  }
}
