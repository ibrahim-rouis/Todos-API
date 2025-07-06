# Todos REST API

A simple and secure RESTful API for managing Todo tasks, built with [Fastify](https://fastify.dev/).

## How to run

### Using Docker:

Simply run:

    npm run compose

> Don't forget to edit `.env` file variables like `JWT_SECRET` with your own secret in case you are using this in production.

### Without Docker:

First edit `.env` file to connect to your own Postgres database then run:

    npm run dev

## Features

- JWT authentication
- Zod schema validation
- RESTful routes (CRUD)
- Type-safe
- Modular service-based architecture
- HATEOAS

## Tech Stack

- NodeJS
- Fastify
- PostgreSQL
- Docker
- Postgrator
- Zod
- fastify-jwt

## Play with API

You can import Postman collection file `Todos API.postman_collection.json` to your Postman and play with the API endpoints.

The collection has scripts handles saving and sending the JWT Token automatically.

## Endpoints

All endpoints except `/register` and `/login` require a valid **JWT token** in the `Authorization` header (`Bearer <token>`).

### `GET /api/todos`

```json
{
  "_links": {
    "self": {
      "href": "/api/todos"
    },
    "todo": {
      "href": "/api/todos/:id"
    }
  },
  "data": [
    {
      "id": 1,
      "title": "Todo 1",
      "description": null,
      "completed": false,
      "created_at": "2025-07-02T08:42:48.481Z",
      "updated_at": "2025-07-02T08:42:48.481Z",
      "user_id": 6
    },
    {
      "id": 3,
      "title": "Todo 2",
      "description": "Some task",
      "completed": false,
      "created_at": "2025-07-02T10:04:58.281Z",
      "updated_at": "2025-07-02T10:04:58.281Z",
      "user_id": 6
    }
  ]
}
```

### `GET /api/todos/:id`

**Response:**

```json
{
  "_links": {
    "self": {
      "href": "/api/todos/3"
    }
  },
  "data": {
    "id": 2,
    "title": "Todo 2",
    "description": "Some task",
    "completed": false,
    "created_at": "2025-07-02T10:04:58.281Z",
    "updated_at": "2025-07-02T10:04:58.281Z",
    "user_id": 6
  }
}
```
