var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var streetSchema = new Schema({

    name: {
        type: String,
        index:true,
        unique:true,
        required: true
    },
    address:{
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    postList: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }]

},{collection: 'street'});

var Street = module.exports = mongoose.model('street', streetSchema);

module.exports.addMemberToStreet =  function(newMemberID, street){

    if(street == null || newMemberID == null){
        return;
    }

    var isMemberExist = street.members.some(function(existingMember){

        return existingMember.equals(newMemberID);

    })

    if(!isMemberExist){
        street.members.push(newMemberID);
        street.save();
    }

}

module.exports.addStreetToMembersList = function(memberID, newStreetID){

    if(newStreetID == null || memberID == null){
        return;
    }

    User.findByIdAndUpdate(
        memberID,
        {$addToSet: { 'local.streets': newStreetID }},
        function(err) {
            if(err)
                throw err;
        }
    )

}
