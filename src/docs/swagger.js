import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import swaggerJsdoc from 'swagger-jsdoc';

import env from '../config/env.js';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

const here = dirname(fileURLToPath(import.meta.url));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MockNest API',
      version: pkg.version,
      description:
        'A lightweight, configurable fake REST API service for frontend development and API testing.\n\n' +
        'Supports `_delay` (simulated latency) and `_status` (simulated errors) query parameters on every endpoint.',
    },
    servers: [
      {
        url: `http://localhost:${env.port}`,
        description: 'Local development server',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'boolean', example: true },
            status: { type: 'integer', example: 404 },
            message: { type: 'string', example: 'users with id 9999 not found' },
            details: {
              type: 'array',
              description: 'Present on 422 validation errors',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'email must be a valid email address' },
                  value: {},
                },
              },
            },
          },
          required: ['error', 'status', 'message'],
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Aarav Sharma' },
            username: { type: 'string', example: 'aarav_sharma' },
            email: { type: 'string', format: 'email', example: 'aarav.sharma@example.com' },
            role: {
              type: 'string',
              enum: ['admin', 'author', 'reader', 'editor'],
              example: 'admin',
            },
            active: { type: 'boolean', example: true },
          },
          required: ['id'],
        },
        UserInput: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Aarav Sharma' },
            username: { type: 'string', example: 'aarav_sharma' },
            email: { type: 'string', format: 'email', example: 'aarav.sharma@example.com' },
            role: {
              type: 'string',
              enum: ['admin', 'author', 'reader', 'editor'],
              example: 'admin',
            },
            active: { type: 'boolean', example: true },
          },
          required: ['name', 'email'],
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 2 },
            title: { type: 'string', example: 'Getting Started with Modern JavaScript' },
            body: {
              type: 'string',
              example: 'A practical guide to writing clean, modern JavaScript.',
            },
            tags: { type: 'array', items: { type: 'string' }, example: ['javascript', 'tutorial'] },
            published: { type: 'boolean', example: true },
          },
          required: ['id'],
        },
        PostInput: {
          type: 'object',
          properties: {
            userId: { type: 'integer', example: 2 },
            title: { type: 'string', example: 'Getting Started with Modern JavaScript' },
            body: {
              type: 'string',
              example: 'A practical guide to writing clean, modern JavaScript.',
            },
            tags: { type: 'array', items: { type: 'string' }, example: ['javascript', 'tutorial'] },
            published: { type: 'boolean', example: true },
          },
          required: ['title', 'body', 'userId'],
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            postId: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 5 },
            body: { type: 'string', example: 'Excellent article! Really cleared things up.' },
            createdAt: { type: 'string', format: 'date-time', example: '2026-01-10T09:24:00.000Z' },
          },
          required: ['id'],
        },
        CommentInput: {
          type: 'object',
          properties: {
            postId: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 5 },
            body: { type: 'string', example: 'Excellent article! Really cleared things up.' },
          },
          required: ['postId', 'body'],
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 10 },
            totalPages: { type: 'integer', example: 1 },
          },
        },
      },
      parameters: {
        pageParam: {
          name: '_page',
          in: 'query',
          description: 'Page number (1-indexed).',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1, example: 2 },
        },
        limitParam: {
          name: '_limit',
          in: 'query',
          description: 'Number of items per page (clamped to a maximum of 100).',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10, example: 5 },
        },
        sortParam: {
          name: '_sort',
          in: 'query',
          description: 'Field to sort the results by.',
          required: false,
          schema: { type: 'string', example: 'name' },
        },
        orderParam: {
          name: '_order',
          in: 'query',
          description: 'Sort direction.',
          required: false,
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc', example: 'desc' },
        },
        delayParam: {
          name: '_delay',
          in: 'query',
          description: 'Simulate a response delay, in milliseconds.',
          required: false,
          schema: { type: 'integer', minimum: 0, example: 1500 },
        },
        statusParam: {
          name: '_status',
          in: 'query',
          description: 'Simulate an error response with this status code (400-599).',
          required: false,
          schema: { type: 'integer', minimum: 400, maximum: 599, example: 500 },
        },
        idParam: {
          name: 'id',
          in: 'path',
          description: 'Resource id.',
          required: true,
          schema: { type: 'integer' },
        },
      },
      responses: {
        NotFound: {
          description: 'The requested resource was not found.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ValidationFailed: {
          description: 'Request validation failed.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        UnexpectedError: {
          description: 'An unexpected server error occurred.',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
  },
  apis: [join(here, 'routes.openapi.js')],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
