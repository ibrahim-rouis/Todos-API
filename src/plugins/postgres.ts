import fp from 'fastify-plugin';
import { PostgresPluginOptions, fastifyPostgres } from '@fastify/postgres';

/**
 * This plugins adds postgres decorator
 */
export default fp<PostgresPluginOptions>(async (fastify, opts) => {
  fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  fastify.decorate(
    'db_connection_wrapper',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function (callback: (client: any) => Promise<void>) {
      const client = await this.pg.connect();
      try {
        await callback(client);
      } finally {
        client.release();
      }
    },
  );

  // Check if database connection is working
  fastify.get('/health/db', async (request, reply) => {
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
    db_connection_wrapper(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback: (client: any) => Promise<void>,
    ): Promise<void>;
  }
}
