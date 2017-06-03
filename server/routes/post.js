/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import mongoose from 'mongoose';
import { Street } from '../models/street';
import { Post } from '../models/post';

const router = expressRouter();

router.post('/addLikeToPost', (req,res) => {

    //TODO: change parameters
    const postID = req.session.postID;
    const userID = req.session.user._id;

    if (!postID || !userID) {
        return res.send('There have been validation errors', 400);
    }

    Post.findByIdAndUpdate(postID, {$addToSet: {likes: userID}}).exec()
        .then(likes => {
                if (likes) {
                    console.log('Added like');
                    return res.send({content: likes, status: 'ok'});
                }
            }
        );

});

router.delete('/unlikePost', (req, res) => {

    const postID = req.session.postID;
    const userID = req.session.user._id;

    if (postID == null || userID == null) {
        return res.send('post or user is missing', 400);
    }

    Post.findByIdAndUpdate(
        {_id: postID},
        {
            $pull: {likes: userID},
        }, err => {
            if (err) throw err;
            else res.status(200).send({ msg: 'unlike post' });
        }
    );
});

router.post('/addPost', (req, res) => {

    const userId = req.session.user._id;
    const { post: { body }, streetId } = req.body;

    if (!userId || !streetId) {
        return res.status(400).send('There have been validation errors');
    }

    const newPost = new Post({
        createDate: Date.now(),
        author: userId,
        body,
    });
    newPost.save((err) => {
        Post.populate(newPost, {
            path: 'author',
        }, (error, post) => {
            Street.findByIdAndUpdate(streetId, {
                $push: { postsfeed: newPost },
            }).exec()
                .then(street => {
                    if (street) {
                        console.log('Added post');
                        return res.status(200).send({ newPost: post, status: 'ok' });
                    }
                });
        });
    });

});

router.post('/addComment', (req, res) => {

    const userId = req.session.user._id;
    const { body, postId } = req.body;

    if (!userId || !postId) {
        return res.status(400).send({ msg: 'There have been validation errors' });
    }

    const newComment = {
        createDate: Date.now(),
        author: req.session.user,
        body,
    }

    Post.findByIdAndUpdate(postId, {
        $push: {
            comments: {
                createDate: Date.now(),
                author: mongoose.Types.ObjectId(userId),
                body,
            },
        },
    },
    { new: true })
        .then(post => {
            console.log('Added comment successfully');
            return res.status(200).send({ newComment, status: 'ok' });
    });
});

router.get('/getPostsFeed', (req, res) => res.status(200).send({ postsfeed: req.session.postsfeed }));

router.get('/getPostsByPlaceId', (req, res) => {

    const { placeId } = req.query;

    if (!placeId) {
        return res.send('placeId', 400);
    }

    Street.findOne({ placeId })
        .populate({
            path: 'postsfeed',
            model: 'post',
            options: {
                sort: { createDate: -1 },
            },
            populate: ['author', 'comments.author'],
        })
        .then(street => {
            if (street) {
                console.log('getPosts executed successfully');
                return res.send({ postsfeed: street.postsfeed, status: 'ok' });
            }
            return res.send({ postsfeed: [], remark: 'street not found' });
        });
});

router.delete('/deletePost', (req, res) => {

    const { postId } = req.body;

    if (!postId) {
        return res.send('postID', 400);
    }

    Post.findByIdAndRemove(postId).exec()
        .then(post => {
                if (post) {
                    console.log('Deleted post');
                    res.status(200).send({ msg: 'Deleted post' });
                }
            }
        );
});

export default router;
