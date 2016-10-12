var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Conversation = new Schema({

    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }]

}, {collection: 'Conversation'});

module.exports = mongoose.model('Conversation', Conversation);
