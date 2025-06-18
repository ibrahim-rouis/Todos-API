import fp from 'fastify-plugin';
import { PostgresPluginOptions, fastifyPostgres } from '@fastify/postgres';

/**
 * This plugins adds postgres decorator
 */
export default fp<PostgresPluginOptions>(async (fastify, opts) => {
  fastify.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  // Check if database connection is working
  fastify.get('/health/db', async (request, reply) => {
    const client = await fastify.pg.connect();

    try {
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
    } finally {
      client.release();
    }
  });
});
