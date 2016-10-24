var express = require('express');
var router = express.Router();
var Street = require('../models/street');
var User = require('../models/user');

router.get('/getStreets', function(req,res) {
//This method returns a list of streets from the user's street list.

    var userID = currentUser;// TO CHANGE

    User.findById(userID, function (err, me) {

        if (err) {// handle error

        } else if (me) {
            var listOfIds = me.local.streets;
            var listOfStreets = [];

            for (var i = 0; i < listOfIds.length; i++) {

                Street.findById(listOfIds[i], function (err, street) {
                    if (err) {

                    } else {
                        listOfStreets.push(street);
                    }

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
    var streetName = req.body.Address,
        streetID = null,
        me = currentUser;

    //Adding a street
    Street.findOne({name: streetName}).then(function(street, err){
        if(err){ //handle exception

        }else if(street){ //The street already exist.
            streetID = street._id;
            addMemberToStreet(street);

        }else{ //Creating a new street.
            var newStreet = new Street({
                name: streetName
            });
            var data = new Street(newStreet);
            data.save();
            addMemberToStreet(newStreet);
            streetID = newStreet._id;

        }

        addStreetToMembersList(streetID);
        res.end('{"success" : "AddStreet execute successfully", "status" : 200}');
    })

});

function addMemberToStreet(street){

    var memberID = currentUser,
        isMemberExist = false;

    if(street == null || memberID == null){
        return;
    }
    else{
        street.members.every(function(member){
            if(member.equals(memberID)){
                isMemberExist = true;
                return false;
            }else return true;
        })
        if(isMemberExist){
            console.log("Member already exist in "+street.name);
        }else{
            street.members.push(memberID);
            street.save();
            console.log("Member has been added successfully to "+street.name);
        }
    }
}

function addStreetToMembersList(newStreet){

    var userID = currentUser;

    if(newStreet == null || userID == null){
        return;
    }

    User.findById(userID, function(err, me){
        if(err){ //handle error

        }else if(me){
            var isStreetExist = false;
            me.local.streets.every(function(streetFromList){
                if(streetFromList.equals(newStreet)){
                    isStreetExist = true;
                    return false;
                }else return true;

            })
            if(isStreetExist){
                console.log("Street already exist on the members list");
            }else {
                me.local.streets.push(newStreet);
                me.save();
                console.log("Street has been added to list");
            }
        }
    })
}

module.exports = router;
