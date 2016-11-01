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

    Post.findByIdAndUpdate(
        postID,
        {$addToSet: { likes: userID }},
        function(err) {
            if(err)
                throw err;
            else
                res.status(200).send({msg: 'Added like'});
        }
    )

});

router.delete('/unlikePost', function(req,res){

    var postID = req.session.postID,
        userID = req.session.user._id;

    if(postID == null || userID == null){
        return res.send('post or user is missing', 400);
    }

    Post.update(
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
    }, function(err, post){
        if(err)
            throw err;
        else {
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

    if(errors || userID == null){
        res.send('There have been validation errors: ' + errors, 400);
    }

    Post.findByIdAndUpdate(postID, {
        $push: { comments: {
            createDate: Date.now(),
            author: userID,
            body: comment
        }}
    }, function(err){
        if(err)
            throw err;
        else{
            console.log('Added comment');
            res.status(200).send({msg:'New comment'});
        }
    });

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
        })
        .exec(function(err,street){
            if(err)
                throw err;
            if(street){
                return res.send(street.postList);
            }
        })

});

module.exports = router;
