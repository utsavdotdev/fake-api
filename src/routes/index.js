import { Router } from 'express';

import resourceRouter from './resourceRouter.js';
import utilRouter from './utilRouter.js';

const router = Router();

router.use(utilRouter);

router.use('/users', resourceRouter('users'));
router.use('/posts', resourceRouter('posts'));
router.use('/comments', resourceRouter('comments'));

export default router;
