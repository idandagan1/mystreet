var express = require('express');
var router = express.Router();
var Street = require('../models/street');
var Post = require('../models/post');

router.post('/addLikeToPost', function(req,res){

    var postID = req.session.postID,
        userID = req.session.user._id;

    if(postID == null || userID == null){
        return res.send('There have been validation errors', 400);
    }

    Post.findByIdAndUpdate( postID, {$addToSet: { likes: userID }}).exec()
        .then(function(post) {
            if(post) {
                return res.status(200).send({msg: 'Added like'})
            }
        });

});

router.delete('/unlikePost', function(req,res){

    var postID = req.session.postID,
        userID = req.session.user._id;

    if(postID == null || userID == null){
        return res.send('post or user is missing', 400);
    }

    Post.findByIdAndUpdate(
        {_id:postID},
        {$pull: {likes: userID}
        },function(err){
            if(err)
                throw err;
            else
                res.status(200).send({msg: 'unlike post'});

        })

});

router.post('/addPost', function(req,res) {

    //TODO: Change Parameters.
    var userID = req.session.user._id,
        post = req.body.post,
        streetID = req.session.streetID;

    req.check('post', 'post is empty').notEmpty();

    var errors = req.validationErrors();

    if (errors || userID == null || streetID == null) {
        return res.send('There have been validation errors: ' + errors, 400);
    };

    var newPost = new Post({
        createDate: Date.now(),
        author: userID,
        body: post
    });
    newPost.save(function(err) {
        if (err)
            throw err;
        req.session.postID = newPost._id;
        req.session.save();
    });

    Street.findByIdAndUpdate(streetID, {
        $push: { postList: newPost}
    }).exec()
        .then(function(street) {
            if (street) {
                console.log('Added post');
                res.status(200).send({msg: 'New post'});
            }
        });

});

router.post('/addComment', function(req,res){

    //TODO: Change parameters
    var userID = req.session.user._id,
        postID = req.session.postID,
        comment = req.body.comment;

    req.check('comment', 'Comment is missing').notEmpty();

    var errors = req.validationErrors();

    if(errors || userID == null || postID == null){
        return res.send('There have been validation errors: ' + errors, 400);
    }


    Post.findByIdAndUpdate(postID,{
        $push: { comments: {
            createDate: Date.now(),
            author: userID,
            body: comment}
        }
    }).then(function(user) {
        if (user) {
            console.log('Added comment');
            res.status(200).send({msg:'New comment'});
        };
    })

});

router.get('/getPosts', function(req,res){

    //TODO: Change Parameters.
    var streetID = req.session.streetID;

    if(streetID == null){
        return res.send('StreetID', 400);
    }

    Street.findOne({'_id': streetID})
        .populate({
            path: 'postList',
            model: 'post',
            populate: [{
                path: 'author',
                model: 'user',
                select: { 'name': 1 }
            },{
                path: 'likes',
                model: 'user',
                select: { 'name': 1 }
            }]
        }).exec()
        .then(function(street) {
            if (street) {
                console.log('getPosts executed successfully');
                return res.send(street.postList);
            }
        })

});

router.delete('/deletePost', function(req,res){

    var postID = req.session.postID;

    if(postID == null){
        return res.send('postID', 400);
    }

    Post.findByIdAndRemove(postID).exec()
        .then(function(post){
            if(post){
                console.log('Deleted post');
                res.status(200).send({msg: 'Deleted post'});
            }
        })
});

module.exports = router;
