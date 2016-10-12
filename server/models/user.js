var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({

    local: {
        username: {
            type: String,
            index: true,
            unique: true,
            required: true},
        name: {
            type: String},
        password: {
            type: String,
            required: true},
        isPremium: {
            type: Boolean},
        isActive: {
            type: Boolean},
        email: {
            type: String},
        lastLogged: {
            type: Date,
            default: Date.now},
        primaryStreet: {
            type: String},
        streets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Street'}]
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }

}, {collection: 'Users'});


userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
