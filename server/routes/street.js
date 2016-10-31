var express = require('express');
var router = express.Router();
var Street = require('../models/street');
var User = require('../models/user');

router.get('/getStreet', function(req,res){

    //TODO: Change parameters
    var streetID = req.session.streetID;

    if(streetID == null){
        return;
    }

    Street.findById(streetID, function(err,street){
        if(err)
            throw err;
        if(street)
            res.send({street:street});
    })

});

router.get('/getStreets', function(req,res) {
//This method returns a list of streets from the user's street list.

    var userID = req.session.user._id;// TO CHANGE

    if(userID == null){
        return;
    }

    User.findById(userID, function (err, me) {

        if (err)
            throw err;
        if (me) {
            var listOfIds = me.local.streets;
            var listOfStreets = [];

            for (var i = 0; i < listOfIds.length; i++) {

                Street.findById(listOfIds[i], function (err, street) {
                    if (err)
                        throw err;
                    else
                        listOfStreets.push(street);

                    if (listOfStreets.length === listOfIds.length) {
                        res.send(listOfStreets);
                    }
                });
            }
        }
    })
});

router.post('/addStreet', function(req,res,next){
//This method is execute when the user choose a street the already exist
// and click on the "Add Street" button.

    //TO DO: Change parameters.
    var streetName = req.body.address,
        userID = req.session.user._id;

    req.check('address', 'Street address is empty').notEmpty();

    var errors = req.validationErrors();

    if (errors || userID == null) {
        res.send('There have been validation errors: ' + errors, 400);
    };

    //Adding a street
    Street.findOne({name: streetName}).then(function(street, err){
        if(err)
            throw err;
        if(street){ //The street already exist.
            req.session.streetID = street._id;
            Street.addMemberToStreet(userID, street);
            console.log('Street already exist');
        }else{ //Creating a new street.

            var newStreet = new Street({name: streetName});
            newStreet.save(function(err) {
                if (err)
                    throw err;
                req.session.streetID = newStreet._id;
            });
            Street.addMemberToStreet(userID, newStreet);
            req.session.streetID = newStreet._id;
            console.log('New street added');
        }

        req.session.save();
        Street.addStreetToMembersList(userID, req.session.streetID);
        res.status(200).send({msg:'AddStreet execute successfully'});
    })

});

module.exports = router;
