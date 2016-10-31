var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = new Schema({

    local: {
        username: {
            type: String,
            index: true,
        },
        name: {
            type: String
        },
        password: {
            type: String
        },
        isPremium: {
            type: Boolean
        },
        isActive: {
            type: Boolean
        },
        email: {
            type: String
        },
        lastLogged: {
            type: Date,
            default: Date.now
        },
        primaryStreet: {
            type: String
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

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.local.password, salt, function(err, hash) {
            newUser.local.password = hash;
            newUser.save(callback);
        });
    });
}


