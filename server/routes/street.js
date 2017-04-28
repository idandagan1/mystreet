/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import { Street, addMember, removeMember } from '../models/street';
import { User, removeStreet } from '../models/user';

const router = expressRouter();

// GET

router.get('/getStreetsNearPrimaryStreet', (req,res) => {

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

                    if(streets) {
                        return res.send({
                            myLocation: myLocation,
                            list: streets,
                            status: "ok"
                        });
                    }

                });

            }
        })

});

router.get('/getStreetsNearby', (req, res) => {

    const radiusInMeters = 500;
    const limit = 8;
    const coords = JSON.parse(req.query.location);

    if (!coords) {
        return res.send('location is missing', 400);
    }

    getStreetsNearPoint(radiusInMeters, limit, coords, streetsNearby => {

        if (streetsNearby) {
            return res.send({
                streetsNearby,
                status: 'ok',
            });
        }
    });

});

router.get('/getStreetByPlaceId', (req, res) => {

    // TODO: Change parameters
    const { place_id } = req.query;

    if (!place_id) {
        return res.send('place_id', 400);
    }

    Street.findOne({ place_id }).populate('members')
        .then((street, err) => {
            return res.status(200).send({ street });
    });
});

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

    if (streetID == null) {
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
    // This method is execute when the user choose a street the already exist
    // and click on the "Add Street" button.

    // const address = req.body.address;
    const { streetName, place_id } = req.body;
    const location = req.body.location ? [req.body.location[0], req.body.location[1]] : null;
    const user_id = req.session.user._id;

    // req.check('address', 'Address is empty').notEmpty();
    req.check('streetName', 'Name is empty').notEmpty();
    req.check('place_id', 'place_id is empty').notEmpty();
    req.check('location', 'location is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || !user_id) {
        return res.status(500).send(`There have been validation errors: ${errors}`, 400);
    }

    Street.findOneAndUpdate({ place_id },
        { $addToSet: { members: user_id } },
        { new: true }).populate('members').exec((err, street) => {
        if (street) {
            req.session.selectedStreet = street;
            console.log('Street already exist');
        } else {
            const newStreet = new Street({
                streetName,
                place_id,
                // address: address,
                members: user_id,
                location,
                admins: user_id,
            });
            newStreet.save((err) => {
                if(err){
                    throw err;
                }
            });
            req.session.selectedStreet = newStreet;
            console.log('New street added');
        }
        req.session.save();

        User.findOneAndUpdate( {_id: user_id },
            { $addToSet: { 'local.streets': req.session.selectedStreet._id } },
            { new: true, passRawResult: true } ).exec((error, user) => {
            if (user) {
                if (user.local.streets.length === 1) {
                    user.local.primaryStreet = req.session.selectedStreet._id;
                    req.session.user.local.primaryStreet = req.session.selectedStreet._id;
                    user.save();
                    console.log('Added street to members list');
                }
                req.session.user = user;
                req.session.save();
            }
            return res.send({ content: { selectedStreet: req.session.selectedStreet, activeUser: req.session.user }, msg: 'AddStreet execute successfully' });
        });
    });
});

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
router.put('/changePrimaryStreet', (req, res) => {

    const newPrimaryStreet = req.body.streetID;
    const userID = req.session.user._id;

    req.check('streetID', 'streetID is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || userID == null || newPrimaryStreet == null) {
        return res.send(`There have been validation errors: ${errors}`, 400);
    }

    User.findOneAndUpdate({ _id: userID }, { 'local.primaryStreet': newPrimaryStreet },
        { upsert: true }).exec()
        .then(user => {
            if (user) {
                console.log('Primary street has been changed');
                res.status(200).send({ msg: 'Primary street has been changed' });
            }
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

    const streetID = req.session.streetID;//TODO: Change to req.body.streetID;
    const userID = req.session.user._id;
    const newStatus = req.body.status;

    if (!streetID || !userID) {
        return res.send('streetID or userID', 400);
    }

    if (newStatus !== 'false' && newStatus !== 'true') {
        return res.send('newStatus', 400);
    }

    Street.findOneAndUpdate({_id: streetID, admins: userID},
        {'isPublic': newStatus},
        {new: true}).exec()
        .then(
            street => {
                if (street) {
                    res.send({content: street, status: "ok", msg: 'Street has been changed'});
                }
            })

});

function getStreetsNearPoint(radius, limit, coords, callback) {

    if (!radius || !coords || coords.length !== 2 ) {
        return;
    }

    Street.find(
        {
            'location': {
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

            if (result) {
                callback(result);
            }
        });

}

export default router;
