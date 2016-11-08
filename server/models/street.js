var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var streetSchema = new Schema({

    place_id: {
        type:String
    },
    name: {
        type: String
    },
    address:{
        type: String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    admins: [{
        type: ObjectId,
        ref: 'user'
    }],
    members: [{
        type: ObjectId,
        ref: 'user'
    }],
    postList: [{
        type: ObjectId,
        ref: 'post'
    }]

},{collection: 'street'});

var Street = module.exports = mongoose.model('street', streetSchema);

module.exports.addMember =  function(newMemberID, streetID){

    if(streetID == null || newMemberID == null){
        return;
    }

    Street.findByIdAndUpdate( streetID, {$addToSet: { members: newMemberID }}).exec()
        .then(function(street) {
            if(street) {
                console.log('Added member');
            }
        });

}

module.exports.removeMember =  function(memberID, streetID){

    if(streetID == null || memberID == null){
        return;
    }

    Street.findByIdAndUpdate(streetID, {$pull: {members: memberID, admins: memberID}},{new:true}).exec()
        .then(function(street) {
            if (street) {
                console.log('Removed member');
                if (street.members.length === 0) {
                    street.remove();
                    console.log('Removed street');
                }
            }
        });

}


