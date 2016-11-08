var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var commentSchema = new Schema({

    createDate: {
        type: Date,
        default: Date.now
    },
    author: {
        type: ObjectId,
        ref:'user'
    },
    body: {
        type: String
    }
});

var postSchema = new Schema({

    postList: {
        type: ObjectId,
        ref: 'postList'
    },
    tags: [{
        type: ObjectId,
        ref: 'user'
    }],
    slug: {
        type: String, trim: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    author: {
        type: ObjectId,
        ref:'user'
    },
    body: {
        type: String
    },
    likes: [{
        type: ObjectId,
        ref:'user'
    }],
    comments: [commentSchema]

}, {collection: 'post'});

module.exports = mongoose.model('post', postSchema);
