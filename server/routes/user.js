/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import passport from 'passport';
import { Street } from '../models/street';
import { User } from '../models/user';
import getFbData from '../models/facebook';
import PersonalDetails from '../models/personalDetails';

const router = expressRouter();

// GET
router.get('/getFriends', (req, res) => {
    // This method returns list of friends from facebook group by streets.

    const token = req.session.user.facebook.token;
    const userId = req.session.user._id;
    const myLocation = 'ChIJSR926opLHRUR6QH6ANhmFe4'; // TODO: replace to the users primaryStreet!

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

router.post('/login/facebook', (req, res) => {
    const { id, name, first_name, last_name, gender, accessToken: token } = req.body;

    // find the user in the database based on their facebook id
    User.findOne({ 'facebook.id': id }).populate([{ path: 'local.primaryStreet', model: 'street' }, { path: 'local.streets', model: 'street' }]).then((user, err) => {
        let sessionUser;

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

        req.session.user = sessionUser;
        req.session.save();
        res.status(200).send({ user: sessionUser });
    });
});

router.post('/updateBasicInfo', (req, res) => {

    const firstName = req.body.firstName;
    const familyName = req.body.familyName;
    const dateOfBirth = req.body.dateOfBirth;
    const gender = req.body.gender;
    const personalDetailsID = req.session.user.local.personalDetails;

    if (!personalDetailsID) {
        return res.send({msg:"personalDetailsId is missing", status: 400});
    }

    const newUpdates = new PersonalDetails({_id: personalDetailsID, firstName, familyName, dateOfBirth, gender});

    updateUserDetails(personalDetailsID, newUpdates, (newUserDetails)=> {
        if (newUserDetails) {
            return res.send({content: newUserDetails, status: "ok"});
        }
    })

})

router.post('/updateProfessionalInfo', (req,res) => {

    const work = req.body.work;
    const college = req.body.college;
    const skills = req.body.skills;
    const personalDetailsID = req.session.user.local.personalDetails;

    if (!personalDetailsID) {
        return res.send({msg:"personalDetailsId is missing", status: 400});
    }

    const newUpdates = new PersonalDetails({_id: personalDetailsID, work, skills, college});

    updateUserDetails(personalDetailsID, newUpdates, (newUserDetails)=> {
        if (newUserDetails) {
            return res.send({content: newUserDetails, status: "ok"});
        }
    })

})

function updateUserDetails(personalDetailsID, updates) {

    PersonalDetails.findOneAndUpdate({'_id': personalDetailsID}, updates,{new:true}).exec()
        .then(details => {
            if (details) {
                console.log('User details have been updated.');
                return details;
            } else {
                console.log('Error while updating user details');
            }
        })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/'); // TODO: change url
}

export default router;
