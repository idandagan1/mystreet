var express = require('express');
var router = express.Router();
var Street = require('../models/street');
var User = require('../models/user');

//GET

router.get('/getStreet', function(req,res){

    //TODO: Change parameters
    var streetID = req.session.streetID;

    if(streetID == null){
        return res.send('StreetID', 400);
    }

    Street.findById(streetID).exec()
        .then(function(street) {
            if (street)
                res.send(street);
        })

});

router.get('/getStreets', function(req,res) {
//This method returns a list of streets from the user's street list.

    var userID = req.session.user._id;// TO CHANGE

    if(userID == null){
        return res.send('UserID', 400);
    }

    User.findOne({'_id': userID}).populate('local.streets').exec()
        .then(function(user) {
            if (user) {
                console.log('getStreets execute successfully');
                return res.send(user.local.streets);
            }
        })

});

router.get('/getMembers', function(req,res){

    //TODO: Change Parameters.
    var streetID = req.session.streetID;

    if(streetID == null){
        return res.send('StreetID', 400);
    }

    Street.findById(streetID).populate('members').exec()
        .then(function(street) {
            if (street) {
                console.log('getMembers executed successfully');
                return res.send(street.members);
            }
        })
})

router.get('/getStreetAdmins', function(req,res){

    var streetID = req.session.streetID;

    if(streetID == null){
        res.send('streetID',400);
    }

    Street.findOne({'_id':streetID},{'admins':1, '_id':0})
        .populate('admins')
        .exec( function(err,street) {
            if (err) throw err;

            if (street) {
                res.send(street.admins)
            }
        })

});

router.get('/getAdmins', function(req,res){

    var streetID = req.session.streetID;

    if(streetID == null){
        return res.send('streetID',400);
    }

    Street.findOne({'_id':streetID},{'admins':1, '_id':0}).populate('admins').exec()
        .then(function(street) {
            if (street) {
                return res.send(street.admins);
            }
        })

});

//POST

router.post('/addStreet', function(req,res){
//This method is execute when the user choose a street the already exist
// and click on the "Add Street" button.

    //TO DO: Change parameters.
    var address = req.body.address,
        streetName = req.body.name,
        placeID = req.body.place_id,
        userID = req.session.user._id;

    req.check('address', 'Address is empty').notEmpty();
    req.check('name', 'Name is empty').notEmpty();
    req.check('place_id', 'place_id is empty').notEmpty();

    var errors = req.validationErrors();

    if (errors || userID == null) {
        return res.status(500).send('There have been validation errors: ' + errors, 400);
    };

    Street.findOne({ 'place_id' : placeID }).exec()
        .then(
            function(street) {

                if (street) {
                    req.session.streetID = street._id;
                    Street.addMember(userID, street._id);
                    //return street;
                } else {
                    var newStreet = new Street({
                        name: streetName,
                        place_id: placeID,
                        address: address,
                        members: userID,
                        admins: userID
                    });
                    newStreet.save();
                    req.session.streetID = newStreet._id;
                    console.log('New street added');
                    //return newStreet;
                }
                req.session.save();
            })
        .then(function(street) {

            User.findOneAndUpdate({'_id': userID},
                {$addToSet: {'local.streets': req.session.streetID}},
                {new: true}).exec()
                .then(
                    function (user) {
                        if (user) {
                            if (user.local.streets.length === 1) {
                                user.local.primaryStreet = req.session.streetID;
                                req.session.user.local.primaryStreet = req.session.streetID;
                                user.save();
                                req.session.save();
                            }
                        }
                        return res.status(200).send({msg: 'AddStreet execute successfully'});
                    })
        });

});

//DELETE

router.delete('/removeStreet', function(req,res){

    //TO DO: Change parameters.
    var streetID = req.session.streetID,
        userID = req.session.user._id;

    if(userID == null || streetID == null){
        return res.send('userID',400);
    }

    try {
        Street.removeMember(userID, streetID);
        User.removeStreet(userID, streetID);
    }catch (e){
        res.send({title:'Error while removing', msg: e},400);
    }

})

//PUT

router.put('/changePrimaryStreet', function(req,res){

    var newPrimaryStreet = req.body.streetID,
        userID = req.session.user._id;

    req.check('streetID','streetID is empty').notEmpty();

    var errors = req.validationErrors();

    if (errors || userID == null || newPrimaryStreet == null) {
        return res.send('There have been validation errors: ' + errors, 400);
    };

    User.findOneAndUpdate({'_id': userID}, {'local.primaryStreet': newPrimaryStreet },
        { upsert : true }).exec()
        .then(function(user) {
            if(user) {
                console.log('Primary street has been changed');
                res.status(200).send({msg: 'Primary street has been changed'});
            }
        })
})

router.put('/addAdmin',function(req,res){

    var newAdminID = req.body.newAdmin,
        streetID = req.session.streetID;

    req.check('newAdmin', 'newAdmin is empty').notEmpty();

    var errors = req.validationErrors();

    if (errors || newAdminID == null) {
        return res.status(500).send('There have been validation errors: ' + errors, 400);
    };

    Street.findByIdAndUpdate( streetID, {$addToSet: { admins: newAdminID }}).exec()
        .then(function(street) {
            if(street) {
                console.log('Added admin');
                return res.status(200).send({msg: 'Added admin'})
            }
        });
})

module.exports = router;
