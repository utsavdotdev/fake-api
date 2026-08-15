import { Router } from 'express';

import * as controller from '../controllers/resourceController.js';
import validate from '../middlewares/validate.js';
import { rules } from '../validators/index.js';

export default function resourceRouter(resource) {
  const router = Router();
  const resourceRules = rules[resource];

  router.use((req, res, next) => {
    req.resource = resource;
    next();
  });

  router.get('/', controller.list);
  router.get('/:id', controller.getOne);
  if (resourceRules) {
    router.post('/', validate(resourceRules.create), controller.create);
    router.put('/:id', validate(resourceRules.update), controller.update);
    router.patch('/:id', validate(resourceRules.patch), controller.patch);
  } else {
    router.post('/', controller.create);
    router.put('/:id', controller.update);
    router.patch('/:id', controller.patch);
  }
  router.delete('/:id', controller.remove);

  return router;
}