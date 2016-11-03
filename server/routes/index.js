import { Router } from 'express';
import postApi from './post.js';
import streetApi from './street.js';
import userApi from './users.js';

const router = Router();

router.use('/posts', postApi);
router.use('/street', streetApi);
router.use('/user', userApi);

export default router;
