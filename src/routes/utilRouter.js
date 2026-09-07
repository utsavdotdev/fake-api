import { Router } from 'express';

import * as db from '../data/db.js';

const router = Router();

router.get('/_meta', (req, res) => {
  res.json({ resources: db.counts() });
});

router.post('/_reset', (req, res) => {
  const resources = db.resetAll();
  res.json({ reset: true, resources });
});

export default router;
