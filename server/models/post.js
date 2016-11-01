var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({

    createDate: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    body: {
        type: String
    }
});

var postSchema = new Schema({

    createDate: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String, trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    body: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref:'user'
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [commentSchema]

}, {collection: 'post'});

module.exports = mongoose.model('post', postSchema);
