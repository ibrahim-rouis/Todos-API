import fp from 'fastify-plugin';
import { CreateUserData, User } from './auth.schemas.js';

export default fp(async (fastify, opts) => {
  fastify.decorate('dbUsers', {
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
        const result = await client.query(
          'select id, username, email, password_hash from users where email = $1',
          [email],
        );

        return result.rows.length > 0 ? result.rows[0] : null;
      });
    },
    getUserById: async function (id: number): Promise<User | null> {
      return await fastify.db_connection_wrapper(async (client) => {
        const result = await client.query(
          'select id, username, email, password_hash from users where id = $1',
          [id],
        );

        return result.rows.length > 0 ? result.rows[0] : null;
      });
    },
  });
});
