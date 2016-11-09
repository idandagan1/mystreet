import { Router as expressRouter } from 'express';
import postApi from './post.js';
import streetApi from './street.js';
import userApi from './user.js';

const router = expressRouter();

router.use('/posts', postApi);
router.use('/street', streetApi);
router.use('/user', userApi);

export default router;
