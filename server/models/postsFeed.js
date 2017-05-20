import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postsFeedSchema = new Schema({

    bucket: {
        type: Number,
    },
    count: {
        type: Number,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post',
    }],
}, { collection: 'postsFeed' });

export default mongoose.model('postsFeed', postsFeedSchema);
