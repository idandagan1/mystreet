var express = require('express');
var router = express.Router();
var passport = require('passport');
var Street = require('../models/street');
var User = require('../models/user');
var facebook = require('../models/facebook');

// GET

router.get('/getFriends', function(req,res){
    //This method returns list of friends from facebook group by streets.

    var token = req.session.user.facebook.token,
        userID = req.session.user._id,
        myLocation = 'ChIJSR926opLHRUR6QH6ANhmFe4';//TODO: replace to the users primaryStreet!

    if(token == null || userID == null || myLocation == null){
        return res.send('There have been validation errors', 400);
    }

    facebook.getFbData(token, '/me/friends', function(data){

        if(data) {
            var parsedList = JSON.parse(data),
                friendsIDs = [];
            parsedList.data.forEach(function (data) {
                friendsIDs.push(data.id);
            });

            User.aggregate(
                {$match: {'facebook.id': {$in: friendsIDs}}},

                {
                    $group: {
                        '_id': '$local.primaryStreet',
                        members: {$push: '$name'}
                    }
                },

                {
                    $project: {
                        _id: 0,
                        details: '$_id',
                        members: 1
                    }
                })
                .exec(function (err, streets) {

                        if (err) throw err;

                        if (streets) {
                            Street.populate(streets, {
                                path: 'details',
                                select: {'place_id': 1, '_id': 0, 'name': 1}
                            }, function (err, populatedStreets) {
                                if (err) throw err;

                                if (populatedStreets) {
                                    return res.send({
                                        myLocation: myLocation,
                                        listOfStreets: populatedStreets
                                    });
                                }
                            });
                        }
                    }
                );
        }
    });
})

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/user/login/facebook' }),
    (req, res) => {
        req.user.local.lastLogged = Date.now();
        req.session.user = req.user;
        req.session.streetID = null;
        req.session.postID = null;

        res.redirect('/');
    });

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/');//TODO: change url
}


module.exports = router;
