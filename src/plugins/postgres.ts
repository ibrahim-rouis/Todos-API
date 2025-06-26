/* eslint-disable @typescript-eslint/no-explicit-any */
import fp from 'fastify-plugin';
import { PostgresPluginOptions, fastifyPostgres } from '@fastify/postgres';

/**
 * This plugin adds postgres decorator and database connection wrapper
 */
export default fp<PostgresPluginOptions>(async (fastify, opts) => {
  fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  fastify.decorate(
    'db_connection_wrapper',
    async function (callback: (client: any) => Promise<any>): Promise<any> {
      const client = await this.pg.connect();
      try {
        return await callback(client);
      } finally {
        client.release();
      }
    },
  );

  // Check if database connection is working
  fastify.get('/api/health', async (request, reply) => {
    await fastify.db_connection_wrapper(async (client) => {
      const { rows } = await client.query('SELECT 1 AS ok');
      if (rows[0].ok === 1) {
        reply.send({ message: 'Database is working' });
      } else {
        reply.status(500).send({
          message: 'Server is not connected to the database',
          error: 'Database connection error',
          statusCode: 500,
        });
      }
    });
  });
});

// Specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    db_connection_wrapper: (
      callback: (client: any) => Promise<any>,
    ) => Promise<any>;
  }
}
