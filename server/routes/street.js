/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import { Street } from '../models/street';
import { User, removeStreet } from '../models/user';

const router = expressRouter();

async function getStreetsNearPrimaryStreet(req, res) {
    const userID = req.session.user._id;
    const radiusInMeters = 2000;
    const limit = 5;
    let myLocation;

    if (!userID) {
        return res.send('UserID', 400);
    }

    await User.findById(userID).populate('local.primaryStreet').exec()
        .then(user => {
            if (user) {
                const coords = [];
                myLocation = user.local.primaryStreet.placeId;
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
}

async function getNearbyStreets(req, res) {
    const maxDistance = 1000;
    const minDistance = 5;
    const limit = 8;
    const coords = JSON.parse(req.query.location);

    if (!coords) {
        return res.send('location is missing', 400);
    }

    await Street.find(
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

}

async function getSelectedStreet(req, res) {
    const { selectedStreet } = req.session;

    if (!selectedStreet || !selectedStreet.placeId) {
        return res.status(200).send({ msg: 'no placeId' });
    }

    await getStreetByPlaceId(selectedStreet.placeId)
        .then(street => {
            req.session.selectedStreet = street;
            req.session.save();
            return res.status(200).send({ selectedStreet: street });
        });
}

async function getStreets(req, res) {
    // This method returns a list of streets from the user's street list.
    const userID = req.session.user._id;// TO CHANGE

    if (!userID) {
        return res.send('UserID', 400);
    }

    await User.findOne({_id: userID}).populate('local.streets').exec()
        .then(user => {
                if (user) {
                    console.log('getStreets execute successfully');
                    return res.send({content: user.local.streets, status: "ok"});
                }
            }
        );
}

async function getMembers(req, res) {

    const { placeId } = req.query;

    if (!placeId) {
        console.log('placeId missing');
        return res.send('placeId', 400);
    }

    await Street.findOne({ placeId }).populate('members')
        .then(selectedStreet => {
            console.log('getMembers executed successfully');
            return res.status(200).send({ selectedStreet });
        });
}

async function getStreetAdmins(req, res) {

    const streetID = req.session.streetID;

    if (streetID == null) {
        res.send('streetID', 400);
    }

    await Street.findOne({ _id: streetID }, { admins: 1, _id: 0 })
        .populate('admins')
        .exec((err, street) => {
                if (err) throw err;

                if (street) {
                    res.send(street.admins);
                }
            }
        );
}

async function addStreet(req, res) {

    const { streetName, placeId, address } = req.body;
    const location = req.body.location ? [req.body.location[0], req.body.location[1]] : null;
    const user_id = req.session.user._id;

    req.check('streetName', 'Name is empty').notEmpty();
    req.check('placeId', 'placeId is empty').notEmpty();
    req.check('location', 'location is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || !user_id) {
        return res.status(500).send(`There have been validation errors: ${errors}`, 400);
    }

    await createStreet(placeId, user_id, location, streetName, address)
        .then(street => {
            req.session.selectedStreet = street;
            req.session.save();
            addStreetToUser(user_id, street, req, res);
        });
}

async function leaveStreet(req, res) {

    const { streetId } = req.query;
    const userId = req.session.user._id;

    if (!userId || !streetId) {
        return res.status(404).send('There have been validation errors', 400);
    }

    await Street.findByIdAndUpdate(streetId, { $pull: { members: userId, admins: userId } }, { new: true })
        .then(street =>
            new Promise((resolve, reject) => {
                if (!street) {
                    reject(street);
                }
                if (street.members.length === 0) {
                    street.remove();
                    console.log('Removed street');
                }
                resolve(street);
            }))
        .then(street => {
                User.findByIdAndUpdate({ _id: userId }, { $pull: { 'local.streets': streetId } },
                    { new: true })
                    .populate(['local.streets', 'local.primaryStreet'])
                    .then(activeUser => {
                        if (activeUser) {
                            if (!activeUser.local.primaryStreet) {
                                activeUser.local.primaryStreet = activeUser.local.streets[0];
                            }
                            activeUser.save();
                            req.session.user = activeUser;
                            req.session.save();
                            console.log('Removed street from users list');
                            return res.status(200).send({ activeUser, msg: 'Primary street has been changed' });
                        }
                    });
            }
        );
}

async function changePrimaryStreet(req, res) {

    const { streetId } = req.query;
    const { user: { _id } } = req.session;

    if (!_id || !streetId) {
        return res.status(400).send({ msg: 'There have been validation errors' });
    }

    await User.findOneAndUpdate({ _id },
        { 'local.primaryStreet': streetId },
        { upsert: true, new: true })
        .populate([{
            path: 'facebook.friends',
            populate: ['local.primaryStreet'],
        }, 'local.streets', 'local.primaryStreet'])
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
}

async function getStreetsNearPoint(radius, limit, coords, callback) {

    if (!radius || !coords || coords.length !== 2) {
        return;
    }

    await Street.find(
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

async function addStreetToUser(user_id, street, req, res) {

    return new Promise((resolve, reject) => {

        if (!user_id || !street) {
            reject(null);
        }

        User.findOneAndUpdate({ _id: user_id },
            { $addToSet: { 'local.streets': street._id } },
            { new: true, passRawResult: true })
            .populate(['local.streets', 'local.primaryStreet', {
                path: 'facebook.friends',
                populate: ['local.primaryStreet'],
            }])
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

async function createStreet(placeId, user_id, location, streetName, address) {

    return new Promise((resolve, reject) => {

        if (!placeId) {
            reject(null);
        }

        Street.findOneAndUpdate({ placeId },
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
                    placeId,
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

async function getStreetByPlaceId(req, res) {

    const { placeId } = req.query;

        if (!placeId) {
            console.log('getStreetByPlaceId: no placeId');
            return;
        }

        await Street.findOne({ placeId })//
            .populate([{
                path: 'postsfeed',
                model: 'post',
                options: {
                    sort: { createDate: -1 },
                },
                populate: ['author', 'comments.author'],
            }, 'members'])
            .then((selectedStreet, err) => {
                return res.status(200).send({ selectedStreet });
            });

}

// GET
router.get('/getStreetsNearPrimaryStreet', getStreetsNearPrimaryStreet);
router.get('/getNearbyStreets', getNearbyStreets);
router.get('/getSelectedStreet', getSelectedStreet);
router.get('/getStreetByPlaceId', getStreetByPlaceId);
router.get('/getStreets', getStreets);
router.get('/getMembers', getMembers);
router.get('/getStreetAdmins', getStreetAdmins);
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
router.post('/addStreet', addStreet);
// DELETE
router.delete('/leaveStreet', leaveStreet);
// PUT
router.post('/changePrimaryStreet', changePrimaryStreet);
router.put('/addAdmin', (req, res) => {

    const newAdminId = req.body.newAdmin;
    const streetId = req.session.streetId;

    req.check('newAdmin', 'newAdmin is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || !newAdminId) {
        return res.status(500).send(`There have been validation errors: ${errors}`, 400);
    }

    Street.findByIdAndUpdate(streetId, { $addToSet: { admins: newAdminId } }).exec()
        .then(street => {
            if (street) {
                console.log('Added admin');
                return res.status(200).send({ msg: 'Added admin' });
            }
        }
    );
});
router.put('/changeStreetPrivacy', (req, res) => {

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

export default router;
