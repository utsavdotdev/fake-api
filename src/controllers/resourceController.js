import * as resourceService from '../services/resourceService.js';
import paginate from '../middlewares/paginate.js';

function resourceOf(req) {
  return req.params.resource || req.resource;
}

export function list(req, res, next) {
  try {
    const data = resourceService.list(resourceOf(req));
    const { _page, _limit, _sort, _order } = req.query;
    res.json(paginate(data, { page: _page, limit: _limit, sort: _sort, order: _order }));
  } catch (err) {
    next(err);
  }
}

export function getOne(req, res, next) {
  try {
    res.json(resourceService.getOne(resourceOf(req), req.params.id));
  } catch (err) {
    next(err);
  }
}

export function create(req, res, next) {
  try {
    const record = resourceService.create(resourceOf(req), req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
}

export function update(req, res, next) {
  try {
    const record = resourceService.update(resourceOf(req), req.params.id, req.body);
    res.json(record);
  } catch (err) {
    next(err);
  }
}

export function patch(req, res, next) {
  try {
    const record = resourceService.patch(resourceOf(req), req.params.id, req.body);
    res.json(record);
  } catch (err) {
    next(err);
  }
}

export function remove(req, res, next) {
  try {
    const record = resourceService.remove(resourceOf(req), req.params.id);
    res.json(record);
  } catch (err) {
    next(err);
  }
}