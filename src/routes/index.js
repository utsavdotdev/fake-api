import { Router } from 'express';

import resourceRouter from './resourceRouter.js';

const router = Router();

router.use('/users', resourceRouter('users'));
router.use('/posts', resourceRouter('posts'));
router.use('/comments', resourceRouter('comments'));

export default router;