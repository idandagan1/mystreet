/* eslint-disable no-underscore-dangle, consistent-return, no-param-reassign */
import { Router as expressRouter } from 'express';
import { Street, addMember, removeMember } from '../models/street';
import { User, removeStreet } from '../models/user';

const router = expressRouter();

// GET

router.get('/getStreetsNearby', (req,res) => {

    const userID = req.session.user._id;

    if (userID == null) {
        return res.send('UserID', 400);
    }

    User.findById(userID).populate('local.primaryStreet').exec()
        .then(user => {
            if (user) {
                const coords = [];
                coords[0] = user.local.primaryStreet.location[0];
                coords[1] = user.local.primaryStreet.location[1];

                Street.find({
                    location: {
                        $geoWithin: {
                            $centerSphere: [coords, (1 / 3959)]
                        }
                    }
                }).exec()
                    .then(result => {
                        if (result) {
                            res.send(result);
                        }
                    })
            }
        })

});

router.get('/getStreet', (req, res) => {
    // TODO: Change parameters
    const streetID = req.session.streetID;

    if (streetID == null) {
        return res.send('StreetID', 400);
    }

    Street.findById(streetID).exec()
        .then(street => {
            if (street) res.send(street);
        }
    );
});

router.get('/getStreets', (req, res) => {
    // This method returns a list of streets from the user's street list.
    const userID = req.session.user._id;// TO CHANGE

    if (userID == null) {
        return res.send('UserID', 400);
    }

    User.findOne({ _id: userID }).populate('local.streets').exec()
        .then(user => {
            if (user) {
                console.log('getStreets execute successfully');
                return res.send(user.local.streets);
            }
        }
    );
});

router.get('/getMembers', (req, res) => {
    // TODO: Change Parameters.
    const streetID = req.session.streetID;

    if (streetID == null) {
        return res.send('StreetID', 400);
    }

    Street.findById(streetID).populate('members').exec()
        .then(street => {
            if (street) {
                console.log('getMembers executed successfully');
                return res.send(street.members);
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
    const location = [req.body.location.lng, req.body.location.lat] ;

    req.check('address', 'Address is empty').notEmpty();
    req.check('name', 'Name is empty').notEmpty();
    req.check('place_id', 'place_id is empty').notEmpty();
    req.check('location', 'location is empty').notEmpty();

    const errors = req.validationErrors();

    if (errors || userID == null) {
        return res.status(500).send(`There have been validation errors: ${errors}`, 400);
    }

    Street.findOne({ place_id: placeID }).exec()
        .then(
            street => {

                if (street) {
                    req.session.streetID = street._id;
                    addMember(userID, street._id);
                    // return street;
                } else {
                    const newStreet = new Street({
                        name: streetName,
                        place_id: placeID,
                        address: address,
                        location: location,
                        members: userID,
                        admins: userID,
                    });
                    newStreet.save();
                    req.session.streetID = newStreet._id;
                    console.log('New street added');
                    // return newStreet;
                }
                req.session.save();
            })
        .then(street => {

            User.findOneAndUpdate({ _id: userID },
                { $addToSet: { 'local.streets': req.session.streetID } },
                { new: true }).exec()
                .then(
                    user => {
                        if (user) {
                            if (user.local.streets.length === 1) {
                                user.local.primaryStreet = req.session.streetID;
                                req.session.user.local.primaryStreet = req.session.streetID;
                                user.save();
                                req.session.save();
                            }
                        }
                        return res.status(200).send({ msg: 'AddStreet execute successfully' });
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

export default router;
