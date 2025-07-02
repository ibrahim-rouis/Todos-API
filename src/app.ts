import * as path from 'node:path';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { fileURLToPath } from 'node:url';
import IndexRoute from './routes/root.js';
import AuthRoutes from './routes/auth/index.js';
import TodosRoutes from './routes/todos/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.PORT) {
  console.error('Please set the PORT in .env file.');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('Please set DATABASE_URL in .env file.');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('Please set JWT_SECRET in .env file.');
}

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts,
    forceESM: true,
  });

  // Add schema validator and serializer
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(IndexRoute, { prefix: '/api' });
  fastify.register(AuthRoutes, { prefix: '/api/auth' });
  fastify.register(TodosRoutes, { prefix: '/api/todos' });
};

export default app;
export { app, options };
