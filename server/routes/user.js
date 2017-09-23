/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import { Street } from '../models/street';
import { User } from '../models/user';
import getFbData from '../models/facebook';
import PersonalDetails from '../models/personalDetails';

const router = expressRouter();

async function getFriends(req, res) {
    // This method returns list of friends from facebook group by streets.

    const token = req.session.user.facebook.token;
    const userId = req.session.user._id;
    const myLocation = 'ChIJSR926opLHRUR6QH6ANhmFe4';

    if (!token || !userId || !myLocation) {
        return res.send('There have been validation errors', 400);
    }

    await getFbData(token, '/me/friends', data => {

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
                            select: { placeId: 1, _id: 0, name: 1 },
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
}

async function getUsersByRadius(req, res) {
    const { radius } = req.query;
    const coords = JSON.parse(req.query.coords);

    await Street.find(
        {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coords,
                    },
                    $maxDistance: (radius * 100),
                    $minDistance: 10,
                },
            },
        })
        .lean()

        .populate([{
            path: 'members',
            populate: ['local.primaryStreet'],
        }, 'local.streets', 'local.primaryStreet'])

        .then(streets => {
            const users = streets.map(street => street.members);
            res.send(users);
        });
}

async function getUserById(req, res) {
    const { userId } = req.query;
    await User.findOne({ 'facebook.id': userId })
        .populate([{
            path: 'facebook.friends',
            populate: ['local.primaryStreet'],
        }, { path: 'local.primaryStreet' }, { path: 'local.streets' }])
        .then(populateuser => {
            res.status(200).send({ selectedUser: populateuser });
        });
}

async function getUserLogin(req, res) {
    const { user: activeUser } = req.session;
    activeUser ?
        await User.findOne({ 'facebook.id': activeUser.facebook.id })
            .populate([{
                path: 'facebook.friends',
                populate: ['local.primaryStreet'],
            }, { path: 'local.primaryStreet' }, { path: 'local.streets' }])
            .then(populateuser => {
                res.status(200).send({ activeUser: populateuser });
            }) : res.status(200).send({ msg: 'user not fund' });

}

async function logoutUser(req, res) {
    req.session.destroy();
    res.status(200).send({ msg: 'user logged out successfully' });
}

function loginFacebook(req, res) {
    const { id, name, first_name, last_name, gender, accessToken: token } = req.body;

    return res.status(200).send({ msg: 'ok' });

    // // find the user in the database based on their facebook id
    // await User.findOne({ 'facebook.id': id })
    //     .populate(['local.primaryStreet', 'local.streets', 'facebook.friends'])
    //     .then((user, err) => {
    //         let sessionUser;
    //
    //         return new Promise((resolve, reject) => {
    //             // if the user is found, then log them in
    //             if (!user) {
    //                 console.log('142: user not exist');
    //                 const newUser = new User({
    //                     facebook: {
    //                         id,
    //                         token,
    //                         name,
    //                         first_name,
    //                         last_name,
    //                         gender,
    //                     },
    //                     name,
    //                 });
    //
    //                 newUser.save(error => {
    //                     if (error) throw error;
    //                 });
    //
    //                 sessionUser = newUser;
    //             } else {
    //                 console.log('160: user exist');
    //                 user.local.lastLogged = Date.now();
    //                 user.save();
    //                 sessionUser = user;
    //             }
    //
    //             resolve(sessionUser);
    //         });
    //     })
    //     .then((user, errors) =>
    //         new Promise((resolve, reject) => {
    //             getFacebookFriends(token)
    //                 .then((friends, error) => {
    //                     console.log('174: getting user friends');
    //                     User.findOneAndUpdate({ 'facebook.id': id },
    //                         { $addToSet: { 'facebook.friends': { $each: friends } } },
    //                         { new: true })
    //                         .populate([{
    //                             path: 'facebook.friends',
    //                             populate: ['local.primaryStreet'],
    //                         }, { path: 'local.primaryStreet' }, { path: 'local.streets' }])
    //                         .then(populateuser => {
    //                             resolve(populateuser);
    //                         });
    //                 });
    //         }))
    //     .then((user) => {
    //         req.session.user = user;
    //         req.session.save();
    //         console.log('190: user');
    //         return res.status(200).send({ user });
    //     });
}

async function updateUserInfo(req, res) {
    const { first_name, last_name, gender, job, newAddress, _id: userId, college } = req.body;
    const { user: { _id } } = req.session;

    if (_id !== userId) {
        res.status(400).send({ msg: 'id does not match' });
    }

    await User.findOneAndUpdate({ _id },
        {
            'facebook.first_name': first_name,
            'facebook.last_name': last_name,
            'facebook.gender': gender,
            'local.job': job,
            'local.college': college,
            //'local.primaryStreet': newAddress,
        },
        { upsert: true, new: true })
        .populate([{
            path: 'facebook.friends',
            populate: ['local.primaryStreet'],
        }, { path: 'local.primaryStreet' }, { path: 'local.streets' }])
        .then(updatedUser => {
            if (updatedUser) {
                console.log('User details have been updated.');
                req.session.user = updatedUser;
                req.session.save();
                res.status(200).send({ activeUser: updatedUser });
            } else {
                console.log('Error while updating user details');
                res.status(200).send({ msg: 'Error while updating user details' });
            }
        });

}

// GET
router.get('/getFriends', getFriends);
router.get('/getUsersByRadius', getUsersByRadius);
router.get('/getUserById', getUserById);
router.get('/getUserLogin', getUserLogin);
router.get('/logoutUser', logoutUser)

// POST
router.post('/login/facebook', loginFacebook);
router.post('/updateUserInfo', updateUserInfo);
router.post('/updateProfessionalInfo', updateProfessionalInfo);

function getFacebookFriends(token) {
    return new Promise((resolve, reject) => {
        getFbData(token, '/me/friends', facebookResult => {

            if (facebookResult) {
                const { data } = JSON.parse(facebookResult);
                const friendsIds = data.map(friend => friend.id);

                User.aggregate(
                    { $match: { 'facebook.id': { $in: friendsIds } } })
                    .then((friends, err) => {
                        err ? reject(err) : resolve(friends.map(user => user._id));
                    });
            }
        });
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

function updateProfessionalInfo(req, res) {

    const { work, college, skills } = req.body;
    const personalDetailsID = req.session.user.local.personalDetails;

    if (!personalDetailsID) {
        return res.send({ msg: 'personalDetailsId is missing', status: 400 });
    }

    const newUpdates = new PersonalDetails({ _id: personalDetailsID, work, skills, college });

    // updateUserDetails(personalDetailsID, newUpdates, (newUserDetails => {
    //     if (newUserDetails) {
    //         return res.send({ content: newUserDetails, status: 'ok' });
    //     }
    // }));

}

export default router;
