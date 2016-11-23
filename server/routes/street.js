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

router.get('/getStreetsNearby', (req,res) => {

    const coords = [];
    const radiusInMeters = 500;
    const limit = 8;
    let myLocation;

    req.check('location', 'location is missing').notEmpty();
    req.check('place_id', 'place_id is missing').notEmpty();

    const error = req.validationErrors();

    if (error) {
        return res.send('location is missing', 400);
    }

    coords[0] = parseFloat(req.query.location.lng, 10);
    coords[1] = parseFloat(req.query.location.lat, 10);
    myLocation = req.query.place_id;

    getStreetsNearPoint(radiusInMeters, limit, coords, streets => {

        if (streets) {
            return res.send({
                myLocation: myLocation,
                list: streets,
                status: "ok"
            });
        }
    })

});

router.get('/getStreet', (req, res) => {

    // TODO: Change parameters
    const place_id = req.query.place_id;

    req.check('place_id', 'place_id is missing').notEmpty();

    const error = req.validationErrors();

    if (error || !place_id) {
        return res.send('place_id', 400);
    }

    Street.findOne({'place_id' : place_id}).exec()
        .then(street => {
                req.session.streetID = street._id;
                req.session.save();
                return res.send({street: street, status:"ok"});
            }
        );
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
    // TODO: Change Parameters.
    const streetID = req.session.streetID;

    if (!streetID) {
        return res.send('StreetID', 400);
    }

    Street.findById(streetID).populate('members').exec()
        .then(street => {
                if (street) {
                    console.log('getMembers executed successfully');
                    return res.send({content: street.members, status: "ok"});
                }
            }
        );
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

    // TO DO: Change parameters.
    const address = req.body.address;
    const streetName = req.body.name;
    const placeID = req.body.place_id;
    const userID = req.session.user._id;
    const location = [req.body.location.lng, req.body.location.lat];

    req.check('address', 'Address is empty').notEmpty();
    req.check('name', 'Name is empty').notEmpty();
    req.check('place_id', 'place_id is empty').notEmpty();
    req.check('location', 'location is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || !userID) {
        return res.status(500).send(`There have been validation errors: ${errors}`, 400);
    }

    Street.findOneAndUpdate({place_id: placeID},
        {$addToSet: {'members': userID}},
        {new: true}).populate('members').exec()
        .then(
            street => {

                if (street) {
                    req.session.streetID = street._id;
                    console.log('Street already exist');
                } else {
                    const newStreet = new Street({
                        name: streetName,
                        place_id: placeID,
                        address: address,
                        members: userID,
                        location: location,
                        admins: userID,
                    });
                    newStreet.save();
                    req.session.streetID = newStreet._id;
                    console.log('New street added');
                }
                req.session.save();

                User.findOneAndUpdate({_id: userID},
                    {$addToSet: {'local.streets': req.session.streetID}},
                    {new: true, passRawResult : true}).exec()
                    .then(
                        user => {
                            if (user) {
                                if (user.local.streets.length === 1) {
                                    user.local.primaryStreet = req.session.streetID;
                                    req.session.user.local.primaryStreet = req.session.streetID;
                                    user.save();
                                    req.session.save();
                                    console.log('Added street to members list');
                                }
                            }
                            return res.send({msg: 'AddStreet execute successfully'});
                        }
                    );

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

function getStreetsNearPoint(radius, limit, coords, callback){

    if(!radius || !coords || coords.length !== 2 ){
        return;
    }

    Street.find(
        {
            'location': {
                $near: {
                    $geometry: {type: 'Point', coordinates: coords},
                    $maxDistance: radius
                }
            }
        }).lean()

        .populate({path: 'members', model: 'user', select: 'name'})

        .select({'_id': 0, 'place_id': 1, 'members': 1})

        .limit(limit).exec()

        .then(result => {

            if (result) {
                callback(result);
            }
        })

}

export default router;
