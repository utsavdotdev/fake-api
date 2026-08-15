import request from 'supertest';

import app from '../../src/app.js';
import swaggerSpec from '../../src/docs/swagger.js';

describe('swagger documentation', () => {
  test('GET /docs/ serves the Swagger UI', async () => {
    const res = await request(app).get('/docs/');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/html/);
    expect(res.text).toContain('swagger-ui');
  });

  test('GET /docs/swagger-ui-init.js serves the spec with the API title and paths', async () => {
    const res = await request(app).get('/docs/swagger-ui-init.js');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/javascript/);
    expect(res.text).toContain('MockNest API');
    expect(res.text).toContain('/api/users');
  });

  test('GET /docs redirects to the trailing-slash UI route', async () => {
    const res = await request(app).get('/docs');
    expect(res.status).toBe(301);
    expect(res.headers.location).toBe('/docs/');
  });

  test('spec defines all three resources with shared components', () => {
    expect(swaggerSpec.openapi).toBe('3.0.0');
    expect(swaggerSpec.info.title).toBe('MockNest API');
    expect(swaggerSpec.servers[0].url).toMatch(/^http:\/\/localhost:\d+/);

    expect(Object.keys(swaggerSpec.paths)).toEqual(
      expect.arrayContaining([
        '/api/users',
        '/api/users/{id}',
        '/api/posts',
        '/api/posts/{id}',
        '/api/comments',
        '/api/comments/{id}',
      ]),
    );

    ['get', 'put', 'patch', 'delete'].forEach((method) => {
      expect(swaggerSpec.paths['/api/users/{id}']).toHaveProperty(method);
    });
    ['get', 'post'].forEach((method) => {
      expect(swaggerSpec.paths['/api/users']).toHaveProperty(method);
    });

    ['User', 'Post', 'Comment', 'Error', 'UserInput', 'PostInput', 'CommentInput'].forEach(
      (schema) => {
        expect(swaggerSpec.components.schemas).toHaveProperty(schema);
      },
    );

    [
      'pageParam',
      'limitParam',
      'sortParam',
      'orderParam',
      'delayParam',
      'statusParam',
      'idParam',
    ].forEach((param) => {
      expect(swaggerSpec.components.parameters).toHaveProperty(param);
    });

    ['NotFound', 'ValidationFailed', 'UnexpectedError'].forEach((response) => {
      expect(swaggerSpec.components.responses).toHaveProperty(response);
    });
  });

  test('list endpoints reference the pagination and simulation parameters', () => {
    const params = swaggerSpec.paths['/api/users'].get.parameters.map((p) => p.$ref);
    expect(params).toEqual(
      expect.arrayContaining([
        '#/components/parameters/pageParam',
        '#/components/parameters/limitParam',
        '#/components/parameters/sortParam',
        '#/components/parameters/orderParam',
        '#/components/parameters/delayParam',
        '#/components/parameters/statusParam',
      ]),
    );
  });
});
