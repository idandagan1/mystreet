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

    Street.findById(streetID, function(err,street){
        if(err)
            throw err;
        if(street)
            res.send(street);
    })

});

router.get('/getStreets', function(req,res) {
//This method returns a list of streets from the user's street list.

    var userID = req.session.user._id;// TO CHANGE

    if(userID == null){
        return;
    }

    User.findOne({'_id': userID}).populate('local.streets').exec(function(err,user){
        if(err)
            throw err;
        if(user){
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

    Street.findOne({'_id': streetID})
        .populate('members')
        .exec(function(err,street){
            if(err)
                throw err;
            if(street){
                return res.send(street.members);
            }
        })

});

//POST

router.post('/addStreet', function(req,res,next){
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
        res.send('There have been validation errors: ' + errors, 400);
    };

    Street.findOne(
        { 'place_id' : placeID }
        ,function(err, street) {

            if (err) throw err;

            if (street) {
                req.session.streetID = street._id;
                Street.addMemberToStreet(userID, street);
                console.log('Street already exist');

            } else {
                var newStreet = new Street({
                    name: streetName,
                    place_id: placeID,
                    address: address,
                    members: userID
                });
                newStreet.save(function (err) {
                    if(err) throw err;
                });
                req.session.streetID = newStreet._id;
                console.log('New street added');

            }

            User.findByIdAndUpdate( userID,
                {$addToSet: { 'local.streets': req.session.streetID }},{new:true},
                function(err,user) {

                    if (err) throw err;

                    if (user) {
                        if(user.local.streets.length === 1){
                            user.local.primaryStreet = req.session.streetID;
                            user.save();
                        }
                    };
                }
            )
            req.session.save();
            res.status(200).send({msg:'AddStreet execute successfully'});
        }
    );

});

//DELETE

router.delete('/removeStreet', function(req,res){

    //TO DO: Change parameters.
    var streetID = req.session.streetID,
        userID = req.session.user._id;

    if(userID == null || streetID == null){
        res.send('userID',400);
    }

    try {
        Street.removeMemberFromStreet(userID, streetID);
        User.removeStreetFromMembersList(userID, streetID);
        console.log('Removed street');
    }catch (e){
        res.send({title:'Error while removing', msg: e},400);
    }

});

//PUT

router.put('/changePrimaryStreet', function(req,res){

    var newPrimaryStreet = req.body.streetID,
        userID = req.session.user._id;

    req.check('streetID','streetID is empty').notEmpty();

    var errors = req.validationErrors();

    if (errors || userID == null) {
        res.send('There have been validation errors: ' + errors, 400);
    };

    User.findOneAndUpdate({'_id': userID},
        {'local.primaryStreet': newPrimaryStreet },
        { upsert : true },
        function(err) {
            if(err)
                throw err;
            else {
                console.log('Primary street has been changed');
                res.status(200).send({msg: 'Primary street has been changed'});
            }
        })
})

module.exports = router;
