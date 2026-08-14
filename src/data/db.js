import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SUPPORTED_RESOURCES = ['users', 'posts', 'comments'];

function loadResource(resource) {
  const seedPath = join(dirname(fileURLToPath(import.meta.url)), 'seed', `${resource}.json`);
  return JSON.parse(readFileSync(seedPath, 'utf8'));
}

const store = Object.fromEntries(
  SUPPORTED_RESOURCES.map((resource) => [resource, loadResource(resource)]),
);

export function resourceExists(resource) {
  return SUPPORTED_RESOURCES.includes(resource);
}

function nextId(resource) {
  const maxId = store[resource].reduce((max, record) => Math.max(max, record.id), 0);
  return maxId + 1;
}

export function getAll(resource) {
  if (!resourceExists(resource)) {
    return null;
  }
  return store[resource].map((record) => ({ ...record }));
}

export function getById(resource, id) {
  const record = store[resource].find((item) => item.id === Number(id));
  return record ? { ...record } : null;
}

export function create(resource, data) {
  const record = { id: nextId(resource), ...data };
  store[resource].push(record);
  return { ...record };
}

export function update(resource, id, data) {
  const index = store[resource].findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return null;
  }
  store[resource][index] = { id: Number(id), ...data };
  return { ...store[resource][index] };
}

export function patch(resource, id, data) {
  const index = store[resource].findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return null;
  }
  store[resource][index] = { ...store[resource][index], ...data, id: Number(id) };
  return { ...store[resource][index] };
}

export function remove(resource, id) {
  const index = store[resource].findIndex((item) => item.id === Number(id));
  if (index === -1) {
    return null;
  }
  const [removed] = store[resource].splice(index, 1);
  return { ...removed };
}
