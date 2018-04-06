import { Router as expressRouter } from 'express';
import {
    addLikeToPost,
    addPost,
    addComment,
    getPostsFeed,
    getPostsByPlaceId,
    deletePost,
    unlikePost
} from '../controllers/post';

const router = expressRouter();

// POST
router.post('/addLikeToPost', addLikeToPost);
router.post('/addPost', addPost);
router.post('/addComment', addComment);
// GET
router.get('/getPostsFeed', getPostsFeed);
router.get('/getPostsByPlaceId', getPostsByPlaceId);
// DELETE
router.delete('/deletePost', deletePost);
router.delete('/unlikePost', unlikePost);

export default router;
