import fp from 'fastify-plugin';
import {
  Todo,
  TodoCreateBody,
  TodoId,
  TodosList,
  TodoUpdateBody,
} from './todos.schemas.js';
import { UserId } from '../auth/auth.schemas.js';

export default fp(async (fastify, opts) => {
  fastify.decorate('dbTodos', {
    create: async function (
      todo: TodoCreateBody & { user_id: UserId },
    ): Promise<void> {
      await fastify.db_connection_wrapper(async (client) => {
        await client.query(
          'insert into todos(title,description, user_id) values($1,$2, $3)',
          [todo.title, todo.description, todo.user_id],
        );
      });
    },
    get: async function (id: TodoId, user_id: UserId): Promise<Todo | null> {
      return await fastify.db_connection_wrapper(async (client) => {
        const results = await client.query(
          'select * from todos where id = $1 and user_id = $2',
          [id, user_id],
        );

        return results.rows.length > 0 ? results.rows[0] : null;
      });
    },
    getAll: async function (user_id: UserId): Promise<TodosList> {
      return await fastify.db_connection_wrapper(async (client) => {
        const results = await client.query(
          'select * from todos where user_id = $1',
          [user_id],
        );

        return results.rows.length > 0
          ? (results.rows as TodosList)
          : <TodosList>[];
      });
    },
    delete: async function (id: TodoId, user_id: UserId): Promise<void> {
      await fastify.db_connection_wrapper(async (client) => {
        await client.query('delete from todos where id=$1 and user_id=$2', [
          id,
          user_id,
        ]);
      });
    },
    update: async function (
      id: TodoId,
      user_id: UserId,
      updatedTodo: TodoUpdateBody,
    ): Promise<void> {
      await fastify.db_connection_wrapper(async (client) => {
        await client.query(
          'update todos set title=$2,description=$3,completed=$4,updated_at=NOW() where id=$1 and user_id=$5',
          [
            id,
            updatedTodo.title,
            updatedTodo.description,
            updatedTodo.completed,
            user_id,
          ],
        );
      });
    },
  });
});
