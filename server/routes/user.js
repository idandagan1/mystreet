/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import passport from 'passport';
import { Street } from '../models/street';
import { User } from '../models/user';
import getFbData from '../models/facebook';
import PersonalDetails from '../models/personalDetails';

const router = expressRouter();

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

// GET
router.get('/getFriends', (req, res) => {
    // This method returns list of friends from facebook group by streets.

    const token = req.session.user.facebook.token;
    const userId = req.session.user._id;
    const myLocation = 'ChIJSR926opLHRUR6QH6ANhmFe4';

    if (!token || !userId || !myLocation) {
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
});

router.get('/getUserById', (req, res) => {
    const { userId } = req.query;
    User.findOne({ 'facebook.id': userId })
        .populate([{
            path: 'facebook.friends',
            populate: ['local.primaryStreet'],
        }, { path: 'local.primaryStreet' }, { path: 'local.streets' }])
        .then(populateuser => {
            res.status(200).send({ selectedUser: populateuser });
        });
})

router.post('/login/facebook', (req, res) => {
    const { id, name, first_name, last_name, gender, accessToken: token } = req.body;

    // find the user in the database based on their facebook id
    User.findOne({ 'facebook.id': id })
        .populate(['local.primaryStreet', 'local.streets', 'facebook.friends'])
        .then((user, err) => {
            let sessionUser;

            return new Promise((resolve, reject) => {
                // if the user is found, then log them in
                if (!user) {
                    const newUser = new User({
                        facebook: {
                            id,
                            token,
                            name,
                            first_name,
                            last_name,
                            gender,
                        },
                        name,
                    });

                    newUser.save(error => {
                        if (error) throw error;
                    });

                    sessionUser = newUser;
                } else {
                    user.local.lastLogged = Date.now();
                    user.save();
                    sessionUser = user;
                }

                resolve(sessionUser);
            });
        })
        .then((user, errors) =>
            new Promise((resolve, reject) => {
                getFacebookFriends(token)
                    .then((friends, error) => {
                        User.findOneAndUpdate({ 'facebook.id': id },
                            { $addToSet: { 'facebook.friends': { $each: friends } } },
                            { new: true })
                            .populate([{
                                path: 'facebook.friends',
                                populate: ['local.primaryStreet'],
                            }, { path: 'local.primaryStreet' }, { path: 'local.streets' }])
                            .then(populateuser => {
                                resolve(populateuser);
                            });
                    });
            }))
        .then((user) => {
            req.session.user = user;
            req.session.save();
            res.status(200).send({ user: user.toJSON() });
        });
});

router.get('/getUserLogin', (req, res) => {
    const { user: activeUser } = req.session;
    activeUser ?
        User.findOne({ 'facebook.id': activeUser.facebook.id })
            .populate([{
                path: 'facebook.friends',
                populate: ['local.primaryStreet'],
            }, { path: 'local.primaryStreet' }, { path: 'local.streets' }])
            .then(populateuser => {
                res.status(200).send({ activeUser: populateuser });
            }) : res.status(200).send({ msg: 'user not fund' });

})

router.post('/updateBasicInfo', (req, res) => {

    const firstName = req.body.firstName;
    const familyName = req.body.familyName;
    const dateOfBirth = req.body.dateOfBirth;
    const gender = req.body.gender;
    const personalDetailsID = req.session.user.local.personalDetails;

    if (!personalDetailsID) {
        return res.send({ msg: 'personalDetailsId is missing', status: 400 });
    }

    const newUpdates = new PersonalDetails({ _id: personalDetailsID, firstName, familyName, dateOfBirth, gender });

    updateUserDetails(personalDetailsID, newUpdates, (newUserDetails) => {
        if (newUserDetails) {
            return res.send({ content: newUserDetails, status: 'ok' });
        }
    });

})

router.post('/updateProfessionalInfo', (req, res) => {

    const { work, college, skills } = req.body;
    const personalDetailsID = req.session.user.local.personalDetails;

    if (!personalDetailsID) {
        return res.send({ msg: 'personalDetailsId is missing', status: 400 });
    }

    const newUpdates = new PersonalDetails({ _id: personalDetailsID, work, skills, college });

    updateUserDetails(personalDetailsID, newUpdates, (newUserDetails => {
        if (newUserDetails) {
            return res.send({ content: newUserDetails, status: 'ok' });
        }
    }));

});

function updateUserDetails(personalDetailsID, updates) {

    PersonalDetails.findOneAndUpdate({ _id: personalDetailsID }, updates, { new: true })
        .then(details => {
            if (details) {
                console.log('User details have been updated.');
                return details;
            }
            console.log('Error while updating user details');
        });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/'); // TODO: change url
}

export default router;
