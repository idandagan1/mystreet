var express = require('express');
var router = express.Router();
var Street = require('../models/street');
var Post = require('../models/post');

router.post('/addLikeToPost', function(req,res){

    var postID = req.session.postID,
        userID = req.session.user._id;

    if(postID == null || userID == null){
        res.send('There have been validation errors', 400);
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

router.get('/getLikesFromPost', function(req,res){

    var postID = '58176a3ed8927328050f6d8f';//req.session.postID,

    if(postID == null){
        res.send('Post ID is missing', 400);
    }

    Post.findById(postID, function (err, post) {

        if (err)
            throw err;

        if (post) {
            var usersIDs = post.likes;
            var users = [];

            for (var i = 0; i < usersIDs.length; i++) {

                User.findById(usersIDs[i], function (err, user) {
                    if (err) {

                    } else {
                        users.push(user);
                    }

                    if (users.length === usersIDs.length) {
                        res.send(users);
                    }
                });
            }
        }
    })
})

router.delete('/unlikePost', function(req,res){

    var postID = req.session.postID,
        userID = req.session.user._id;

    if(postID == null || userID == null){
        res.send('post or user is missing', 400);
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
        res.send('There have been validation errors: ' + errors, 400);
    };

    var newPost = new Post({
        when: Date.now(),
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
            when: Date.now(),
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
    var userID = currentUser,
        streetID = '580e06a7093a4e6f63f712b8';

    if(userID == null || streetID == null){
        return;
    }

    Street.findById(streetID, function (err, street) {

        if (err)
            throw err;

        if (street) {
            var postListIDs = street.postList;
            var postList = [];

            for (var i = 0; i < postListIDs.length; i++) {

                Post.findById(postListIDs[i], function (err, post) {
                    if (err) {

                    } else {
                        postList.push(post);
                    }

                    if (postList.length === postListIDs.length) {
                        res.send(postList);
                    }
                });
            }
        }
    })

});

module.exports = router;
