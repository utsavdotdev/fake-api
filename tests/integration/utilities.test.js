import request from 'supertest';

import app from '../../src/app.js';
import * as db from '../../src/data/db.js';

describe('utility endpoints', () => {
  afterEach(() => {
    db.resetAll();
  });

  test('GET /api/_meta lists every supported resource with a count', async () => {
    const res = await request(app).get('/api/_meta');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.resources)).toBe(true);
    const names = res.body.resources.map((r) => r.resource);
    expect(names).toEqual(['users', 'posts', 'comments']);
    res.body.resources.forEach(({ count }) => {
      expect(count).toBeGreaterThan(0);
    });
  });

  test('GET /api/_meta reflects current in-memory counts after mutations', async () => {
    db.create('users', { name: 'Probe', email: 'probe@example.com' });
    const res = await request(app).get('/api/_meta');
    const users = res.body.resources.find((r) => r.resource === 'users');
    expect(users.count).toBeGreaterThan(10);
  });

  test('POST /api/_reset restores seed records after create/delete', async () => {
    const before = await request(app).get('/api/_meta');
    const usersBefore = before.body.resources.find((r) => r.resource === 'users').count;
    expect(usersBefore).toBe(10);

    await request(app).post('/api/users').send({ name: 'Doomed', email: 'doomed@example.com' });
    await request(app).delete('/api/users/1');

    const mutated = await request(app).get('/api/_meta');
    expect(mutated.body.resources.find((r) => r.resource === 'users').count).toBe(usersBefore);

    const reset = await request(app).post('/api/_reset');
    expect(reset.status).toBe(200);
    expect(reset.body).toMatchObject({ reset: true });
    expect(reset.body.resources).toEqual(
      expect.arrayContaining([
        { resource: 'users', count: usersBefore },
        { resource: 'posts', count: expect.any(Number) },
        { resource: 'comments', count: expect.any(Number) },
      ]),
    );

    const after = await request(app).get('/api/users');
    expect(after.body.data).toHaveLength(usersBefore);
    expect(after.body.data.find((u) => u.id === 1)).toBeDefined();
    expect(after.body.data.find((u) => u.name === 'Doomed')).toBeUndefined();
  });

  test('POST /api/_reset restores posts and comments too', async () => {
    await request(app).post('/api/posts').send({ userId: 1, title: 'Throwaway', body: 'x' });
    await request(app).delete('/api/comments/1');

    const reset = await request(app).post('/api/_reset');
    const posts = reset.body.resources.find((r) => r.resource === 'posts');
    const comments = reset.body.resources.find((r) => r.resource === 'comments');
    expect(posts.count).toBe(10);
    expect(comments.count).toBe(10);

    const postsRes = await request(app).get('/api/posts');
    expect(postsRes.body.data).toHaveLength(10);
    const commentsRes = await request(app).get('/api/comments/1');
    expect(commentsRes.status).toBe(200);
  });
});
