/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import passport from 'passport';
import { Street } from '../models/street';
import { User } from '../models/user';
import getFbData from '../models/facebook';

const router = expressRouter();

// GET
router.get('/getFriends', (req, res) => {
    // This method returns list of friends from facebook group by streets.

    const token = req.session.user.facebook.token;
    const userID = req.session.user._id;
    const myLocation = 'ChIJSR926opLHRUR6QH6ANhmFe4'; // TODO: replace to the users primaryStreet!

    if (token == null || userID == null || myLocation == null) {
        return res.send('There have been validation errors', 400);
    }

    getFbData(token, '/me/friends', data => {

        if (data) {
            const parsedList = JSON.parse(data);
            const friendsIDs = [];

            parsedList.data.forEach(friend => {
                friendsIDs.push(friend.id);
            });

            User.aggregate(
                { $match: { 'facebook.id': { $in: friendsIDs } } },
                {
                    $group: {
                        _id: '$local.primaryStreet',
                        members: { $push: '$name' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        details: '$_id',
                        members: 1,
                    },
                })
                .exec((err, streets) => {
                    if (err) throw err;

                    if (streets) {
                        Street.populate(streets, {
                            path: 'details',
                            select: { place_id: 1, _id: 0, name: 1 },
                        }, (error, populatedStreets) => {
                            if (error) throw error;

                            if (populatedStreets) {
                                return res.send({
                                    myLocation,
                                    listOfStreets: populatedStreets,
                                });
                            }
                        });
                    }
                });
        }
    });
});

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
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/'); // TODO: change url
}


export default router;
