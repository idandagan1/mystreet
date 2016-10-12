var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Conversation = new Schema({

    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message' }]

}, {collection: 'Conversation'});

module.exports = mongoose.model('Conversation', Conversation);
