import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import {
  CreateUserData,
  LoginUserData,
  RegisterUserData,
  User,
  UserId,
  UserProfile,
} from './auth/auth.schemas.js';
import {
  Todo,
  TodoCreateBody,
  TodoId,
  TodosList,
  TodoUpdateBody,
} from './todos/todos.schemas.js';

const IndexRoute: FastifyPluginAsync<FastifyPluginOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  const { prefix } = opts;

  fastify.get('/', async function (request, reply) {
    return {
      _links: {
        self: { href: `${prefix.toString()}` },
        auth: {
          href: `${prefix.toString()}/auth`,
          description: 'Authentication API',
        },
      },
      version: '1.0.0',
      status: 'OK',
    };
  });
};

declare module 'fastify' {
  export interface FastifyInstance {
    dbUsers: {
      createUser: (user: CreateUserData) => Promise<void>;
      getUserByEmail: (email: string) => Promise<User | null>;
      getUserById: (id: number) => Promise<User | null>;
    };
    dbTodos: {
      create: (todo: TodoCreateBody & { user_id: UserId }) => Promise<void>;
      get: (id: TodoId, user_id: UserId) => Promise<Todo | null>;
      getAll: (user_id: UserId) => Promise<TodosList>;
      delete: (id: TodoId, user_id: UserId) => Promise<void>;
      update: (
        id: TodoId,
        user_id: UserId,
        updatedTodo: TodoUpdateBody,
      ) => Promise<void>;
    };
    authServices: {
      registerUser: (user: RegisterUserData) => Promise<void>;
      loginUser: (userReq: LoginUserData) => Promise<UserProfile>;
    };
    todosServices: {
      create: (todo: TodoCreateBody & { user_id: UserId }) => Promise<void>;
      get: (id: TodoId, user_id: UserId) => Promise<Todo | null>;
      getAll: (user_id: UserId) => Promise<TodosList>;
      delete: (id: TodoId, user_id: UserId) => Promise<void>;
      update: (
        id: TodoId,
        user_id: UserId,
        updatedTodo: TodoUpdateBody,
      ) => Promise<void>;
    };
  }
}

export default IndexRoute;
