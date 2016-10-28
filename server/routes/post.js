var express = require('express');
var router = express.Router();
var Street = require('../models/street');
var Post = require('../models/post');

router.post('/addPost', function(req,res) {

    //TODO: Change Parameters.
    var userID = currentUser,
        post = req.body.post,
        streetID = '580e06a7093a4e6f63f712b8';

    if(userID == null || !post || post.length === 0){
        return;
    }

    Street.findById(streetID, function(err, street){
        if(err){

        }else if(street){
            var newPost = new Post({
                when: Date.now(),
                author: userID,
                body: post
            });
            newPost.save();
            street.postList.push(newPost._id);
            street.save(function(err){
                if(!err){
                    console.log('New post in ' + street.name);
                    res.send('{"success" : "AddStreet execute successfully", "status" : 200}');
                }
            });
        }
    })

});

router.get('/getPosts', function(req,res){

    //TODO: Change Parameters.
    var userID = currentUser,
        streetID = '580e06a7093a4e6f63f712b8';

    if(userID == null || streetID == null){
        return;
    }

    Street.findById(streetID, function (err, street) {

        if (err) {// handle error

        } else if (street) {
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
