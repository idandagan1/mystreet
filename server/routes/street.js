/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import { Street, addMember, removeMember } from '../models/street';
import { User, removeStreet } from '../models/user';

const router = expressRouter();

// GET

router.get('/getStreetsNearPrimaryStreet', (req, res) => {

    const userID = req.session.user._id;
    const radiusInMeters = 2000;
    const limit = 5;
    let myLocation;

    if (!userID) {
        return res.send('UserID', 400);
    }

    User.findById(userID).populate('local.primaryStreet').exec()
        .then(user => {
            if (user) {
                const coords = [];
                myLocation = user.local.primaryStreet.place_id;
                coords[0] = user.local.primaryStreet.location[0];
                coords[1] = user.local.primaryStreet.location[1];

                getStreetsNearPoint(radiusInMeters, limit, coords, streets =>{

                    if (streets) {
                        return res.send({
                            myLocation,
                            list: streets,
                            status: 'ok',
                        });
                    }

                });

            }
        });

});

router.get('/getNearbyStreets', (req, res) => {

    const maxDistance = 1000;
    const minDistance = 5;
    const limit = 8;
    const coords = JSON.parse(req.query.location);

    if (!coords) {
        return res.send('location is missing', 400);
    }

    Street.find(
        {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coords,
                    },
                    $maxDistance: maxDistance,
                    $minDistance: minDistance,
                },
            },
        })
        .lean()

        .populate({ path: 'members', model: 'user' })

        .limit(limit)

        .then(streetsNearby =>
            res.send({
                streetsNearby,
                status: 'ok',
            })
        );

});

router.get('/getSelectedStreet', (req, res) => {

    const { selectedStreet } = req.session;

    if (!selectedStreet || !selectedStreet.place_id) {
        return res.status(200).send({ msg: 'no place_id' });
    }

    getStreetByPlaceId(selectedStreet.place_id)
        .then(street => {
            req.session.selectedStreet = street;
            req.session.save();
            return res.status(200).send({ selectedStreet: street });
        });
});

router.get('/getStreetByPlaceId', (req, res) => {

    const { place_id } = req.query;

    if (!place_id) {
        return res.status(200).send({ msg: 'no place_id' });
    }

    getStreetByPlaceId(place_id)
        .then(selectedStreet => {
            req.session.selectedStreet = selectedStreet;
            req.session.save();
            return res.status(200).send({ selectedStreet });
        });
});

function getStreetByPlaceId(place_id) {

    return new Promise((resolve, reject) => {

        if(!place_id){
            reject(null);
        }

        Street.findOne({ place_id })//
            .populate([{
                path: 'postsfeed',
                model: 'post',
                options: {
                    sort: { createDate: -1 },
                },
                populate: ['author', 'comments.author'],
            },
                { path: 'members', model: 'user' }])
            .then((selectedStreet, err) => resolve(selectedStreet));
    });
}

router.get('/getStreets', (req, res) => {
    // This method returns a list of streets from the user's street list.
    const userID = req.session.user._id;// TO CHANGE

    if (!userID) {
        return res.send('UserID', 400);
    }

    User.findOne({_id: userID}).populate('local.streets').exec()
        .then(user => {
                if (user) {
                    console.log('getStreets execute successfully');
                    return res.send({content: user.local.streets, status: "ok"});
                }
            }
        );
});

router.get('/getMembers', (req, res) => {

    const { place_id } = req.query;

    if (!place_id) {
        return res.send('StreetID', 400);
    }

    Street.findOne({ place_id }).populate('members')
        .then(street => {
            console.log('getMembers executed successfully');
            return res.send({ content: street ? street.members : null, status: 'ok' });
        });
});

router.get('/getStreetAdmins', (req, res) => {
    const streetID = req.session.streetID;

    if (streetID == null) {
        res.send('streetID', 400);
    }

    Street.findOne({ _id: streetID }, { admins: 1, _id: 0 })
        .populate('admins')
        .exec((err, street) => {
            if (err) throw err;

            if (street) {
                res.send(street.admins);
            }
        }
    );
});

router.get('/getAdmins', (req, res) => {
    const streetID = req.session.streetID;

    if (!streetID) {
        return res.send('streetID', 400);
    }

    Street.findOne({ _id: streetID }, { admins: 1, _id: 0 }).populate('admins').exec()
        .then(street => {
            if (street) {
                return res.send(street.admins);
            }
        }
    );
});

// POST
router.post('/addStreet', (req, res) => {

    const { streetName, place_id, address } = req.body;
    const location = req.body.location ? [req.body.location[0], req.body.location[1]] : null;
    const user_id = req.session.user._id;

    req.check('streetName', 'Name is empty').notEmpty();
    req.check('place_id', 'place_id is empty').notEmpty();
    req.check('location', 'location is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || !user_id) {
        return res.status(500).send(`There have been validation errors: ${errors}`, 400);
    }

    createStreet(place_id, user_id, location, streetName, address)
        .then(street => {
            req.session.selectedStreet = street;
            req.session.save();
            addStreetToUser(user_id, street, req, res);
        });
});

function addStreetToUser(user_id, street, req, res) {

    return new Promise((resolve, reject) => {

        if (!user_id || !street) {
            reject(null);
        }

        User.findOneAndUpdate({ _id: user_id },
            { $addToSet: { 'local.streets': street._id } },
            { new: true, passRawResult: true })
            .populate([{ path: 'local.streets' }, { path: 'local.primaryStreet' }])
            .then((user, err) => {
                if (user) {
                    if (user.local.streets.length === 1) {
                        user.local.primaryStreet = street;
                        user.save();
                        console.log('Added street to members list');
                    }
                    req.session.user = user;
                    req.session.save();
                }
                Street.populate(street, [{
                    path: 'postsfeed',
                    model: 'post',
                    options: {
                        sort: { createDate: -1 },
                    },
                    populate: ['author', 'comments.author'],
                }, { path: 'members', model: 'user' }])
                    .then(populatedStreet => res.send({
                        content: {
                            selectedStreet: populatedStreet,
                            activeUser: user,
                        },
                        msg: 'AddStreet execute successfully',
                    }));
            });
    });
}

function createStreet(place_id, user_id, location, streetName, address) {

    return new Promise((resolve, reject) => {

        if (!place_id) {
            reject(null);
        }

        Street.findOneAndUpdate({ place_id },
            { $addToSet: { members: user_id } },
            { new: true })
            .populate('members')
            .then((street, err) => {
                if (street) {
                    console.log('Street already exist');
                    return resolve(street);
                }
                const selectedStreet = new Street({
                    streetName,
                    place_id,
                    members: user_id,
                    location,
                    address,
                    admins: user_id,
                });
                selectedStreet.save();
                console.log('New street added');
                resolve(selectedStreet);
            });
    });
}

// DELETE
router.delete('/removeStreet', (req, res) => {
    // TO DO: Change parameters.
    const streetID = req.session.streetID;
    const userID = req.session.user._id;

    if (userID == null || streetID == null) {
        return res.send('userID', 400);
    }

    try {
        removeMember(userID, streetID);
        removeStreet(userID, streetID);
    } catch (e) {
        res.send({ title: 'Error while removing', msg: e }, 400);
    }
});

// PUT
router.post('/changePrimaryStreet', (req, res) => {

    const { street_id } = req.query;
    const { user: { _id: user_id } } = req.session;

    if (!user_id || !street_id) {
        return res.status(400).send({ msg: 'There have been validation errors' });
    }

    User.findOneAndUpdate({ _id: user_id },
        { 'local.primaryStreet': street_id },
        { upsert: true, new: true })
        .populate(['local.streets', 'local.primaryStreet'])
        .then(activeUser => {
            if (activeUser) {
                req.session.user = activeUser;
                req.session.save();
                console.log('Primary street has been changed');
                return res.status(200).send({ activeUser, msg: 'Primary street has been changed' });
            }
            return res.status(200).send({ msg: 'Error while changing street' });
        }
    );
});

router.put('/addAdmin', (req, res) => {

    const newAdminID = req.body.newAdmin;
    const streetID = req.session.streetID;

    req.check('newAdmin', 'newAdmin is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || newAdminID == null) {
        return res.status(500).send(`There have been validation errors: ${errors}`, 400);
    }

    Street.findByIdAndUpdate(streetID, { $addToSet: { admins: newAdminID } }).exec()
        .then(street => {
            if (street) {
                console.log('Added admin');
                return res.status(200).send({ msg: 'Added admin' });
            }
        }
    );
});

router.put('/changeStreetPrivacy', (req,res) => {

    const streetID = req.session.streetID;
    const userID = req.session.user._id;
    const newStatus = req.body.status;

    if (!streetID || !userID) {
        return res.send('streetID or userID', 400);
    }

    if (newStatus !== 'false' && newStatus !== 'true') {
        return res.send('newStatus', 400);
    }

    Street.findOneAndUpdate({ _id: streetID, admins: userID },
        { isPublic: newStatus },
        { new: true }).exec()
        .then(
            street => {
                if (street) {
                    res.send({ content: street, status: 'ok', msg: 'Street has been changed' });
                }
            });

});

function getStreetsNearPoint(radius, limit, coords, callback) {

    if (!radius || !coords || coords.length !== 2) {
        return;
    }

    Street.find(
        {
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: coords },
                    $maxDistance: radius,
                    $minDistance: 10,
                },
            },
        }).lean()

        .populate({ path: 'members', model: 'user', select: 'name' })

        .limit(limit)

        .then(result => {
            callback(result);
        });

}

export default router;
