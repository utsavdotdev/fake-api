import env from '../config/env.js';

const DEFAULT_PAGE = 1;
const MAX_PAGE_LIMIT = 100;

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function sortItems(items, field, order) {
  const direction = order === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    const aValue = a[field] ?? '';
    const bValue = b[field] ?? '';
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });
}

export default function paginate(data, { page, limit, sort, order } = {}) {
  const safePage = toPositiveInt(page, DEFAULT_PAGE);
  const safeLimit = Math.min(toPositiveInt(limit, env.defaultPageLimit), MAX_PAGE_LIMIT);
  const safeOrder = order === 'desc' ? 'desc' : 'asc';

  const total = data.length;
  const sorted = sort ? sortItems(data, sort, safeOrder) : [...data];
  const start = (safePage - 1) * safeLimit;
  const items = sorted.slice(start, start + safeLimit);

  return {
    data: items,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}
