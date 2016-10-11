var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.createConnection('localhost:27017/local');
var Schema = mongoose.Schema;

var Conversation = new Schema({

    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message' }]

}, {collection: 'Conversation'});

module.exports = mongoose.model('Conversation', Conversation);
