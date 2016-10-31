var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({

    postList: {
        type: Schema.Types.ObjectId,
        ref: 'postList'
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    slug: {
        type: String, trim: true
    },
    when: {
        type: Date,
        default: Date.now
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
    comments: [{

        when: {
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
    }]

}, {collection: 'post'});

module.exports = mongoose.model('post', postSchema);
