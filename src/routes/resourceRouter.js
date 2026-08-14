import { Router } from 'express';

import * as controller from '../controllers/resourceController.js';

export default function resourceRouter(resource) {
  const router = Router();

  router.use((req, res, next) => {
    req.resource = resource;
    next();
  });

  router.get('/', controller.list);
  router.get('/:id', controller.getOne);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.patch('/:id', controller.patch);
  router.delete('/:id', controller.remove);

  return router;
}