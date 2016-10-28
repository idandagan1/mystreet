var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postListSchema = new Schema({

    bucket:{
        type: Number
    },
    count: {
        type: Number
    },
    posts:[{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }]

}, {collection: 'postList'});

module.exports = mongoose.model('postList', postListSchema);
