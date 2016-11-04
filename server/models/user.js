var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    name: {
        type:String,
        required: true
    },
    local: {

        isPremium: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean
        },
        lastLogged: {
            type: Date,
            default: Date.now
        },
        primaryStreet: {
            type: Schema.Types.ObjectId,
            ref: 'street'
        },
        streets: [{
            type: Schema.Types.ObjectId,
            ref: 'street'
        }]
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }

}, {collection: 'user'});

var User = module.exports = mongoose.model('user', userSchema);

module.exports.removeStreetFromMembersList = function(memberID, streetID){

    if(streetID == null || memberID == null){
        return;
    }

    User.findByIdAndUpdate(
        {_id : memberID },
        {$pull : {'local.streets' : streetID}},
        { new : true},function(err,user){
            if(err)
                throw err;
            if(user){

                if(user.local.streets.length === 0){
                    user.local.primaryStreet = null;
                }else if(user.local.primaryStreet === streetID){
                    user.local.primaryStreet = user.local.streets[0];
                }
            }
        }
    )
}
