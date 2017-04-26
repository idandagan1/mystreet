import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({

    createDate: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: ObjectId,
        ref: 'user',
    },
    body: {
        type: String,
    },
});

const postSchema = new Schema({

    postList: {
        type: ObjectId,
        ref: 'postList',
    },
    tags: [{
        type: ObjectId,
        ref: 'user',
    }],
    slug: {
        type: String,
        trim: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: ObjectId,
        ref: 'user',
    },
    body: {
        type: String,
    },
    likes: [{
        type: ObjectId,
        ref: 'user',
    }],
    comments: [commentSchema],
}, { collection: 'post' });

export const Post = mongoose.model('post', postSchema);
