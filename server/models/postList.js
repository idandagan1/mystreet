var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postListSchema = new Schema({
    /*
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],*/
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'message'
    }]

}, {collection: 'postList'});

module.exports = mongoose.model('postList', postListSchema);
