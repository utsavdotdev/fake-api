import request from 'supertest';

import app from '../../src/app.js';

describe('users resource API', () => {
  test('GET /api/users returns a paginated list', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.meta).toMatchObject({
      page: 1,
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  test('GET /api/users respects _page and _limit', async () => {
    const res = await request(app).get('/api/users?_page=2&_limit=3');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.meta).toMatchObject({ page: 2, limit: 3 });
  });

  test('POST /api/users creates a user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Integration Tester', email: 'integration@example.com' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'Integration Tester',
      email: 'integration@example.com',
    });
    expect(res.body.id).toEqual(expect.any(Number));
  });

  test('GET /api/users/:id returns the created user', async () => {
    const created = await request(app)
      .post('/api/users')
      .send({ name: 'Fetch Me', email: 'fetch@example.com' });
    const res = await request(app).get(`/api/users/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Fetch Me', email: 'fetch@example.com' });
  });

  test('PUT /api/users/:id replaces the user', async () => {
    const created = await request(app)
      .post('/api/users')
      .send({ name: 'Old Name', email: 'old@example.com' });
    const res = await request(app)
      .put(`/api/users/${created.body.id}`)
      .send({ name: 'New Name', email: 'new@example.com' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'New Name', email: 'new@example.com' });
    expect(res.body.id).toBe(created.body.id);
  });

  test('PATCH /api/users/:id partially updates the user', async () => {
    const created = await request(app)
      .post('/api/users')
      .send({ name: 'Patch Base', email: 'patch@example.com' });
    const res = await request(app)
      .patch(`/api/users/${created.body.id}`)
      .send({ name: 'Patched Name' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Patched Name');
    expect(res.body.email).toBe('patch@example.com');
  });

  test('DELETE /api/users/:id removes the user', async () => {
    const created = await request(app)
      .post('/api/users')
      .send({ name: 'Delete Me', email: 'delete@example.com' });
    const res = await request(app).delete(`/api/users/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
    const after = await request(app).get(`/api/users/${created.body.id}`);
    expect(after.status).toBe(404);
  });

  test('GET /api/users/:id with a nonexistent id returns 404', async () => {
    const res = await request(app).get('/api/users/9999');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('PUT /api/users/:id with a nonexistent id returns 404', async () => {
    const res = await request(app)
      .put('/api/users/9999')
      .send({ name: 'Ghost', email: 'ghost@example.com' });
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('PATCH /api/users/:id with a nonexistent id returns 404', async () => {
    const res = await request(app).patch('/api/users/9999').send({ name: 'Ghost' });
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('DELETE /api/users/:id with a nonexistent id returns 404', async () => {
    const res = await request(app).delete('/api/users/9999');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('POST /api/users with an invalid body returns 422 with field errors', async () => {
    const res = await request(app).post('/api/users').send({ name: 'No Email' });
    expect(res.status).toBe(422);
    expect(res.body.error).toBe(true);
    expect(res.body.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'email' })]),
    );
  });

  test('GET /api/users?_status=500 returns the simulated error', async () => {
    const res = await request(app).get('/api/users?_status=500');
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ error: true, status: 500 });
  });

  test('GET /api/users?_delay=10 succeeds without error', async () => {
    const res = await request(app).get('/api/users?_delay=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/nope returns a clean 404 for unmatched routes', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: true, status: 404 });
  });

  test('GET /health responds ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
