var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports.removeMemberFromStreet =  function(memberID, streetID){

    if(streetID == null || memberID == null){
        return;
    }

    Street.update(
        {_id:streetID},
        {$pull: {members: memberID}
        },function(err){
            if(err)
                throw err;
        }
    )
}
