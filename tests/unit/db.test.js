import * as db from '../../src/data/db.js';

describe('db CRUD', () => {
  test('getById returns a record for an existing id', () => {
    const record = db.getById('users', 1);
    expect(record).not.toBeNull();
    expect(record.id).toBe(1);
  });

  test('getById returns a clone, not a live reference', () => {
    const record = db.getById('users', 1);
    record.name = 'mutated';
    expect(db.getById('users', 1).name).not.toBe('mutated');
  });

  test('getById returns null for a missing id', () => {
    expect(db.getById('users', 9999)).toBeNull();
  });

  test('resourceExists validates supported resources', () => {
    expect(db.resourceExists('users')).toBe(true);
    expect(db.resourceExists('nope')).toBe(false);
  });

  test('create assigns the next id and stores the data', () => {
    const created = db.create('users', { name: 'Unit Tester', email: 'unit@example.com' });
    expect(created.id).toBe(11);
    expect(created.name).toBe('Unit Tester');
    expect(db.getById('users', created.id).name).toBe('Unit Tester');
  });

  test('create returns a clone, not a live reference', () => {
    const created = db.create('users', { name: 'Clone Test', email: 'clone@example.com' });
    created.name = 'changed';
    expect(db.getById('users', created.id).name).toBe('Clone Test');
  });

  test('update replaces fields and preserves id', () => {
    const updated = db.update('users', 2, { name: 'Updated Name' });
    expect(updated).toEqual({ id: 2, name: 'Updated Name' });
    expect(db.getById('users', 2)).toEqual({ id: 2, name: 'Updated Name' });
  });

  test('update returns null for a missing id', () => {
    expect(db.update('users', 9999, { name: 'x' })).toBeNull();
  });

  test('patch merges only the provided fields', () => {
    const original = db.getById('users', 3);
    const patched = db.patch('users', 3, { name: 'Patched Name' });
    expect(patched.name).toBe('Patched Name');
    expect(patched.email).toBe(original.email);
    expect(patched.id).toBe(3);
  });

  test('patch returns null for a missing id', () => {
    expect(db.patch('users', 9999, { name: 'x' })).toBeNull();
  });

  test('remove deletes the record and returns it', () => {
    const removed = db.remove('users', 4);
    expect(removed.id).toBe(4);
    expect(db.getById('users', 4)).toBeNull();
  });

  test('remove returns null for a missing id', () => {
    expect(db.remove('users', 9999)).toBeNull();
  });

  test('getAll returns clones of every record', () => {
    const all = db.getAll('users');
    const snapshot = all.map((item) => item.id).sort((a, b) => a - b);
    all[0].name = 'mutated';
    expect(db.getById('users', all[0].id).name).not.toBe('mutated');
    expect(snapshot.length).toBeGreaterThan(0);
  });
});
