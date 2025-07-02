import {
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyRequest,
} from 'fastify';
import {
  TodoCreateBody,
  TodoCreateBodySchema,
  TodoSchema,
  TodosListSchema,
  TodoUpdateBody,
  TodoUpdateBodySchema,
} from './todos.schemas.js';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import dbServices from './todos.services.js';
import z from 'zod';

const TodosRoutes: FastifyPluginAsync<FastifyPluginOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Plug services
  fastify.register(dbServices);

  // Verify jwt for all requests in todos resource.
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  const { prefix } = opts;

  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        response: {
          200: z.object({
            _links: z.object({}).passthrough(),
            data: TodosListSchema,
          }),
        },
      },
    },
    async function (request, reply) {
      const todos = await fastify.todosServices.getAll(request.user.id);
      return {
        status: 'success',
        _links: {
          self: { href: `${prefix.toString()}` },
          todo: { href: `${prefix.toString()}/:id` },
        },
        data: todos,
      };
    },
  );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/',
      { schema: { body: TodoCreateBodySchema } },
      async function (
        request: FastifyRequest<{ Body: TodoCreateBody }>,
        reply,
      ) {
        await fastify.todosServices.create({
          ...request.body,
          user_id: request.user.id,
        });
        return reply.status(204).send();
      },
    );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            _links: z.object({}).passthrough(),
            data: TodoSchema,
          }),
        },
      },
    },
    async function (
      request: FastifyRequest<{
        Params: { id: number };
      }>,
      reply,
    ) {
      const { id } = request.params;
      const todo = await fastify.todosServices.get(id, request.user.id);

      return {
        status: 'success',
        _links: {
          self: { href: `${prefix.toString()}/${id}` },
        },
        data: todo,
      };
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.coerce.number(),
        }),
        body: TodoUpdateBodySchema,
      },
    },
    async function (
      request: FastifyRequest<{ Body: TodoUpdateBody; Params: { id: number } }>,
      reply,
    ) {
      const { id } = request.params;
      await fastify.todosServices.update(id, request.user.id, request.body);

      return reply.status(204).send();
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.coerce.number(),
        }),
      },
    },
    async function (
      request: FastifyRequest<{
        Params: { id: number };
      }>,
      reply,
    ) {
      const { id } = request.params;
      await fastify.todosServices.delete(id, request.user.id);

      return reply.status(204).send();
    },
  );
};

export default TodosRoutes;
