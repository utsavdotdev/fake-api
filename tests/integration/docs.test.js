import request from 'supertest';

import app from '../../src/app.js';
import swaggerSpec from '../../src/docs/swagger.js';

describe('swagger documentation', () => {
  test('GET /swagger-docs/ serves the Swagger UI', async () => {
    const res = await request(app).get('/swagger-docs/');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/html/);
    expect(res.text).toContain('swagger-ui');
  });

  test('GET /docs/ serves the Fumadocs site when built', async () => {
    const res = await request(app).get('/docs/');
    // 200 when the static export exists (docs/out), 404 otherwise
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.text).toContain('MockNest');
    }
  });

  test('GET / redirects to the docs home page when built', async () => {
    const res = await request(app).get('/');
    // 302 to /docs/ when the static export exists, otherwise 404
    expect([302, 404]).toContain(res.status);
    if (res.status === 302) {
      expect(res.headers.location).toBe('/docs/');
    }
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
