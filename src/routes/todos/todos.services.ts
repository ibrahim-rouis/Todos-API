import fp from 'fastify-plugin';
import todosDB from './todos.db.js';
import {
  Todo,
  TodoCreateBody,
  TodoId,
  TodosList,
  TodoUpdateBody,
} from './todos.schemas.js';
import { UserId } from '../auth/auth.schemas.js';

export default fp(async (fastify, opts) => {
  fastify.register(todosDB);

  fastify.decorate('todosServices', {
    create: async function (todo: TodoCreateBody & { user_id: UserId }) {
      await fastify.dbTodos.create(todo);
    },
    get: async function (id: TodoId, user_id: UserId): Promise<Todo | null> {
      return await fastify.dbTodos.get(id, user_id);
    },
    getAll: async function (user_id: UserId): Promise<TodosList> {
      return await fastify.dbTodos.getAll(user_id);
    },
    delete: async function (id: TodoId, user_id: UserId): Promise<void> {
      await fastify.dbTodos.delete(id, user_id);
    },
    update: async function (
      id: TodoId,
      user_id: UserId,
      updatedTodo: TodoUpdateBody,
    ): Promise<void> {
      await fastify.dbTodos.update(id, user_id, updatedTodo);
    },
  });
});
