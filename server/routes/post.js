/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import mongoose from 'mongoose';
import { Street } from '../models/street';
import { Post } from '../models/post';

const router = expressRouter();

async function addLikeToPost(req, res) {

    const { postId, user: { _id: userId } } = req.session;

    if (!postId || !userId) {
        return res.status(400).send('There have been validation errors', 400);
    }

    try {
        const likes = await Post.findByIdAndUpdate(postID, { $addToSet: { likes: userID } }).exec();
        console.log('Added like');
        return res.send({ content: likes, status: 'ok' });
    } catch(err){
        console.error(err);
    }

}

async function addComment(req, res) {

    const { postId, comment: { body, authorId, date } } = req.body;

    if (!authorId || !postId) {
        return res.status(400).send({ msg: 'There have been validation errors' });
    }

    try {

        const post = await Post.findByIdAndUpdate(postId, {
            $push: {
                comments: {
                    createDate: date,
                    author: mongoose.Types.ObjectId(authorId),
                    body,
                },
            },
        }, { new: true }).exec();

        console.log('Added comment successfully');
        return res.status(200).send({ post, status: 'ok' });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ msg: 'addComment failed' });
    }
}

async function getPostsByPlaceId(req, res) {

    const { placeId } = req.query;

    if (!placeId) {
        return res.status(400).send('placeId', 400);
    }

    try {

        const street = await Street.findOne({ placeId })
                .populate({
                    path: 'postsfeed',
                    model: 'post',
                    options: {
                        sort: { createDate: -1 },
                    },
                    populate: ['author', 'comments.author'],
                }).exec();

        console.log('getPosts executed successfully');
        return res.send({ postsfeed: street.postsfeed, status: 'ok' });
    } catch(err){
        console.error(err);
        return res.send({ postsfeed: [], remark: 'street not found' });
    }

}

async function deletePost(req, res) {

    const { id } = req.query;

    if (!id) {
        return res.send('post id missing', 400);
    }

    try {
        await Post.findByIdAndRemove(id).exec();
        console.log('Deleted post: ', id);
        return res.status(200).send({ msg: 'Deleted post' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ msg: 'delete post has failed' });
    }

}

function unlikePost(req, res) {

    const { postID, userID }  = req.session;

    if (!postID || !userID) {
        return res.send('post or user is missing', 400);
    }

    Post.findByIdAndUpdate(
        { _id: postID },
        {
            $pull: { likes: userID },
        }, err => {
            if (err) throw err;
            else res.status(200).send({ msg: 'unlike post' });
        }
    );
}

function addPost(req, res) {

    const userId = req.session.user._id;
    const { post: { body, imageUrl }, streetId } = req.body;

    if (!userId || !streetId) {
        return res.status(400).send('There have been validation errors');
    }

    const newPost = new Post({
        createDate: Date.now(),
        author: userId,
        imageUrl,
        body,
    });

    newPost.save((err) => {
        if (err) throw err;
        Post.populate(newPost, {
            path: 'author',
        }, (error, post) => {
            Street.findByIdAndUpdate(streetId, {
                $push: { postsfeed: newPost },
            })
                .then(street => {
                    console.log(`Added post by ${userId}`);
                    return res.status(200).send({ newPost: post, status: 'ok' });
                });
        });
    });

}

function getPostsFeed(req, res) {
    return res.status(200).send({ postsfeed: req.session.postsfeed });
}

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
