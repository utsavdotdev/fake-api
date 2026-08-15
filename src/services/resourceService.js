import * as db from '../data/db.js';
import { NotFoundError } from '../utils/errors.js';

function requireResource(resource) {
  if (!db.resourceExists(resource)) {
    throw new NotFoundError(resource, '*');
  }
}

export function list(resource) {
  requireResource(resource);
  return db.getAll(resource);
}

export function getOne(resource, id) {
  requireResource(resource);
  const record = db.getById(resource, id);
  if (!record) {
    throw new NotFoundError(resource, id);
  }
  return record;
}

export function create(resource, data) {
  requireResource(resource);
  return db.create(resource, data);
}

export function update(resource, id, data) {
  requireResource(resource);
  const record = db.update(resource, id, data);
  if (!record) {
    throw new NotFoundError(resource, id);
  }
  return record;
}

export function patch(resource, id, data) {
  requireResource(resource);
  const record = db.patch(resource, id, data);
  if (!record) {
    throw new NotFoundError(resource, id);
  }
  return record;
}

export function remove(resource, id) {
  requireResource(resource);
  const record = db.remove(resource, id);
  if (!record) {
    throw new NotFoundError(resource, id);
  }
  return record;
}
