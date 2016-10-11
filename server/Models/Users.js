var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.createConnection('localhost:27017/local');
var Schema = mongoose.Schema;

var Users = new Schema({

    userName: {
        type: String,
        index:true,
        unique:true,
        required: true},
    password: {
        type: String,
        required: true},
    isPremium: {type: Boolean},
    isActive: {type: Boolean},
    email: {type: String},
    lastLogged: {
        type: Date,
        default: Date.now },
    primaryStreet: {type: String},
    streets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Street' }]

}, {collection: 'Users'});

module.exports = mongoose.model('Users', Users);
