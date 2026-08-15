import express from 'express';
import request from 'supertest';

import resourceRouter from '../../src/routes/resourceRouter.js';
import errorHandler from '../../src/middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.use('/unknown', resourceRouter('unknown'));
app.use(errorHandler);

describe('resource without validation rules', () => {
  test('GET /unknown returns 404 via the error handler', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('POST /unknown returns 404 for an unknown resource', async () => {
    const res = await request(app).post('/unknown').send({ name: 'x' });
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('PUT /unknown/1 returns 404 for an unknown resource', async () => {
    const res = await request(app).put('/unknown/1').send({ name: 'x' });
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('PATCH /unknown/1 returns 404 for an unknown resource', async () => {
    const res = await request(app).patch('/unknown/1').send({ name: 'x' });
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('DELETE /unknown/1 returns 404 for an unknown resource', async () => {
    const res = await request(app).delete('/unknown/1');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });
});
