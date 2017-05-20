/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
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
            else res.status(200).send({msg: 'unlike post'});
        }
    );
});

router.post('/addPost', (req, res) => {

    const userId = req.session.user._id;
    const { post: { text }, streetId } = req.body;

    req.check('post', 'post is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || !userId || !streetId) {
        return res.send(`There have been validation errors: ${errors}`, 400);
    }

    const newPost = new Post({
        createDate: Date.now(),
        author: userId,
        body: text,
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
                        res.send({ newPost: post, status: 'ok' });
                    }
                });
        })
    });

});

router.post('/addComment', (req, res) => {
    // TODO: Change parameters
    const userID = req.session.user._id;
    const postID = req.session.postID;
    const comment = req.body.comment;

    req.check('comment', 'Comment is missing').notEmpty();

    const errors = req.validationErrors();

    if (errors || userID == null || postID == null) {
        return res.send(`There have been validation errors: ${errors}`, 400);
    }

    Post.findByIdAndUpdate(postID, {
        $push: {
            comments: {
                createDate: Date.now(),
                author: userID,
                body: comment,
            },
        },
    }).then(post => {
        if (post) {
            console.log('Added comment');
            res.send({ post, status: 'ok' });
        }
    });
});

router.get('/getPostsFeed', (req, res) => res.status(200).send({ postsfeed: req.session.postsfeed }));

router.get('/getPostsByPlaceId', (req, res) => {

    const { place_id } = req.query;

    if (!place_id) {
        return res.send('place_id', 400);
    }

    Street.findOne({ place_id })
        .populate({
            path: 'postsfeed',
            model: 'post',
            options: {
                sort: { createDate: -1 },
            },
            populate: [{
                path: 'author',
                model: 'user',
            },
            {
                path: 'likes',
                model: 'user',
                select: { name: 1 },
            }],
        }).exec()
        .then(street => {
            if (street) {
                console.log('getPosts executed successfully');
                return res.send({ postsfeed: street.postsfeed, status: 'ok' });
            }
            return res.send({ postsfeed: [], remark: 'street not found' });
        });
});

router.delete('/deletePost', (req, res) => {

    const postID = req.session.postID;

    if (postID == null) {
        return res.send('postID', 400);
    }

    Post.findByIdAndRemove(postID).exec()
        .then(post => {
                if (post) {
                    console.log('Deleted post');
                    res.status(200).send({msg: 'Deleted post'});
                }
            }
        );
});

export default router;
