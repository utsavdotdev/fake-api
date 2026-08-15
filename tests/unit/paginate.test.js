import paginate from '../../src/middlewares/paginate.js';

const DATA = [
  { id: 3, name: 'charlie' },
  { id: 1, name: 'alice' },
  { id: 2, name: 'bob' },
];

describe('paginate', () => {
  test('returns all items with default page and limit', () => {
    const result = paginate(DATA);
    expect(result.data).toHaveLength(3);
    expect(result.meta).toEqual({ page: 1, limit: 10, total: 3, totalPages: 1 });
  });

  test('slices by page and limit', () => {
    const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
    const result = paginate(items, { page: 2, limit: 10 });
    expect(result.data.map((item) => item.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(result.meta).toEqual({ page: 2, limit: 10, total: 25, totalPages: 3 });
  });

  test('returns empty data for page beyond range', () => {
    const result = paginate(DATA, { page: 99, limit: 10 });
    expect(result.data).toEqual([]);
    expect(result.meta.page).toBe(99);
    expect(result.meta.totalPages).toBe(1);
  });

  test('clamps limit to MAX_PAGE_LIMIT (100)', () => {
    const result = paginate(DATA, { page: 1, limit: 500 });
    expect(result.meta.limit).toBe(100);
  });

  test('falls back to defaults for invalid page and limit', () => {
    const result = paginate(DATA, { page: 'abc', limit: -5 });
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
  });

  test('sorts ascending by default', () => {
    const result = paginate(DATA, { sort: 'name' });
    expect(result.data.map((item) => item.name)).toEqual(['alice', 'bob', 'charlie']);
  });

  test('sorts descending', () => {
    const result = paginate(DATA, { sort: 'name', order: 'desc' });
    expect(result.data.map((item) => item.name)).toEqual(['charlie', 'bob', 'alice']);
  });

  test('sorts by numeric field correctly', () => {
    const result = paginate(DATA, { sort: 'id' });
    expect(result.data.map((item) => item.id)).toEqual([1, 2, 3]);
  });

  test('does not mutate the input array', () => {
    const original = [...DATA];
    paginate(DATA, { sort: 'name' });
    expect(DATA).toEqual(original);
  });
});
