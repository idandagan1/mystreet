var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({

    _id: {
        type:Schema.Types.ObjectId
    },
    postDate: {
        type: Date,
        default: Date.now
    },
    author: {
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    text: {
        type: String
    },
    comments:[{
        commentDate: {
            type: Date,
            default: Date.now
        },
        author: {
            type:Schema.Types.ObjectId,
            ref:'user'
        },
        comment: {
            type: String
        }
    }]

}, {collection: 'post'});

module.exports = mongoose.model('post', postSchema);
